import type { ServerRoute } from "@hapi/hapi";
import Boom from "@hapi/boom";
import Joi from "joi";
import { db } from "../models/db.js";
import { capabilities } from "../auth/capabilities.js";
import { hasCapability } from "../auth/authorise.js";

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
          inputs: Joi.object().required(), // KFRE inputs (age, eGFR, ACR,gender )
        }).required(),
      },
    },

    handler: async (request: any, h: any) => {
      const { userId, role } = request.auth.credentials;

      if (!hasCapability(role, capabilities.RESULTS_CREATE)) {
        throw Boom.forbidden("Not allowed to create results");
      }

      // Mock output (Python will replace this later)
      const outputs = {
        kfreRisk: 12.3,
        unit: "%",
        interpretation: "Mock result (Python integration pending)",
      };

      /**Persist result with ownership*/

      const result = await db.resultStore?.create(
        userId,
        request.payload.inputs,
        outputs
      );

      return h.response(result).code(201);
    },
  },

  /* ===============================
     LIST RESULTS (RBAC)
     =============================== */
  list: {
    options: {
      auth: { scope: ["user", "scientist", "admin"] },
    },

    handler: async (request: any) => {
      const { role, userId } = request.auth.credentials;

      if (hasCapability(role, capabilities.RESULTS_READ_ALL)) {
        return db.resultStore?.findAll();
      }

      if (hasCapability(role, capabilities.RESULTS_READ_OWN)) {
        return db.resultStore?.findByUser(userId);
      }

      throw Boom.forbidden("Not allowed to view results");
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
