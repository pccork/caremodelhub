import type { ServerRoute } from "@hapi/hapi";
import Joi from "joi";
import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const auditApi: Pick<ServerRoute, "options" | "handler"> = {
  options: {
    auth: { scope: ["admin", "scientist"] },
    validate: {
      query: Joi.object({
        mrn: Joi.string().optional(),
        specimenNo: Joi.string().optional(),
        userId: Joi.string().optional(),
      }),
    },
  },

  handler: async (request: any) => {
    const { mrn, specimenNo, userId } = request.query;

    if (mrn) return db.auditStore?.findByMrn(mrn);
    if (specimenNo) return db.auditStore?.findBySpecimen(specimenNo);
    if (userId) return db.auditStore?.findByUser(userId);

    return db.auditStore?.listAll();
  },
};
