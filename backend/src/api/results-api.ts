import type { ServerRoute } from "@hapi/hapi";
import Boom from "@hapi/boom";
import Joi from "joi";
import { db } from "../models/db.js";
import { capabilities } from "../auth/capabilities.js";
import { hasCapability } from "../auth/authorise.js";
import { calculateKfre } from "../services/kfre-client.js";
import crypto from "crypto";

export const resultsApi: {
  create: Pick<ServerRoute, "options" | "handler">;
  list: Pick<ServerRoute, "options" | "handler">;
  delete: Pick<ServerRoute, "options" | "handler">;
} = {
  /* ===============================
     CREATE RESULT (user)
     =============================== */
  create: {
    options: {
      auth: { scope: ["user"] },// only users reach handler
      validate: {
        payload: Joi.object({
          mrn: Joi.string()
            .trim()
            .max(32)
            .required(),

          specimenNo: Joi.string()
            .pattern(/^BC\d{6}$/)
            .required()
            .messages({
              "string.pattern.base":
                "Specimen number must be in format BC###### (e.g. BC000123)",
            }),

          inputs: Joi.object({
            age: Joi.number().integer().min(18).max(110).required(),
            sex: Joi.string().valid("male", "female").required(),
            egfr: Joi.number().min(1).max(200).required(),
            acr: Joi.number().positive().required(),
          }).required(),
        }),
      },
    },

    handler: async (request: any, h: any) => {
      const { userId, role } = request.auth.credentials;
      // RBAC check
      if (!hasCapability(role, capabilities.RESULTS_CREATE)) {
        throw Boom.forbidden("Not allowed to create results");
      }

      const { mrn, specimenNo, inputs } = request.payload;

      /* ===============================
     DUPLICATE PREVENTION (NEW)
     =============================== */
      const recentExists = await db.resultStore?.existsRecent(
        mrn,
        specimenNo,
        3
      );

      if (recentExists) {
         try {
            if (db.auditStore) {
              await db.auditStore.record({
                actorId: userId,
                actorRole: role,
                action: "DUPLICATE_BLOCKED",
                targetType: "RESULT",
                mrn,
                specimenNo,
                summary: "Duplicate specimen/MRN blocked within 3-month window",
                source: "api",
              });
            }
          } catch (auditErr) {
            console.error("Audit logging failed:", auditErr);
            // continue execution
          }
        
      
      // Create an audit trail when a duplicate is blocked
      /*await db.auditStore?.record({
        actorId: userId,
        actorRole: role,
        action: "DUPLICATE_BLOCKED",
        targetType: "RESULT",
        mrn,
        specimenNo,
        summary: "Duplicate specimen/MRN blocked within 3-month window",
        source: "api",
      });*/

      throw Boom.conflict(
          "A KFRE calculation for this MRN and specimen number has already been recorded within the past 3 months. Please review the existing result via the Dashboard."
        );
      }


      // const kfreResult = await calculateKfre(inputs);
      const kfreResult = await calculateKfre(inputs);

      /**Persist result with ownership*/

      const result = await db.resultStore?.create({
        userId,
        mrn: request.payload.mrn,
        specimenNo: request.payload.specimenNo,
        inputs: request.payload.inputs,
        outputs: { kfre: kfreResult },
        model: kfreResult.model,
        modelVersion: kfreResult.model_version,
      });
      if (!result) {
        throw Boom.internal("Result persistence failed");
      }

    /* ===================
     AUDIT RECORD (NEW)
     ======================*/
  const inputsHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(inputs))
    .digest("hex");

  await db.auditStore?.record({
    actorId: userId,
    actorRole: role,
    action: "CALCULATE_RESULT",
    targetType: "RESULT",
    targetId: result._id.toString(),
    mrn,
    specimenNo,
    model: kfreResult.model,
    modelVersion: kfreResult.model_version,
    requestId: kfreResult.request_id,inputsHash,
    summary: "KFRE 5-year risk calculated",
    source: "api",
  });

      return h.response(result).code(201);
    },
  },

  /* ===============================
     LIST / SEARCH RESULTS (RBAC + AUDIT)
     =============================== */
  list: {
    options: {
      auth: { scope: ["user", "scientist", "admin"] },
      validate: {
        query: Joi.object({
          mrn: Joi.string().trim().max(32).optional(),
          specimenNo: Joi.string().trim().max(32).optional(),
        }),
      },
    },

    handler: async (request: any) => {
      const { role, userId } = request.auth.credentials;
      const { mrn, specimenNo } = request.query;


      // All clinicians can search all patients
      if (!hasCapability(role, capabilities.RESULTS_READ_ALL) &&
        !hasCapability(role, capabilities.RESULTS_READ_OWN)) {
      throw Boom.forbidden();
    }

    let results;

    if (mrn || specimenNo) {
      // SEARCH (intentful)
      results = await db.resultStore?.search({
        mrn,
        specimenNo,
      });

      // ======================
      // AUDIT SEARCH INTENT
      // ======================
      try {
        if (db.auditStore) {
          await db.auditStore.record({
            actorId: userId,
            actorRole: role,
            action: "SEARCH_RESULTS",
            targetType: "RESULT",
            mrn,
            specimenNo,
            summary: "Clinical search of KFRE results",
            source: "api",
          });
        }
      } catch (auditErr) {
        console.error("Audit logging failed (search):", auditErr);
  // Do NOT block search results
      }
      /*this block made serch not work
      await db.auditStore?.record({
        actorId: userId,
        actorRole: role,
        action: "SEARCH_RESULTS",
        targetType: "RESULT",
        mrn,
        specimenNo,
        summary: "Clinical search of KFRE results",
        source: "api",
      });
      */


     } else {
      // LIST ALL (dashboard)
      results = hasCapability(role, capabilities.RESULTS_READ_ALL)
        ? await db.resultStore?.findAll()
        : await db.resultStore?.findByUser(userId);
    }

    return results;
    },
  },

  

  /* ===============================
     DELETE RESULT (admin)
     =============================== */
  delete: {
    options: {
      auth: { scope: ["admin"] },
    },

    handler: async (request: any, h: any) => {
      const { role } = request.auth.credentials;
      const { id } = request.params;

      if (!hasCapability(role, capabilities.RESULTS_DELETE)) {
        throw Boom.forbidden("Not allowed to delete results");
      }

      await db.resultStore?.deleteById(request.params.id);
      return h.response().code(204);
    },
  },
};
