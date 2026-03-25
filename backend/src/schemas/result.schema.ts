/**
 * src/schemas/result.schema.ts
 *
 * Joi validation schema for creating a KFRE calculation result.
 *
 * This schema defines the API request contract and validates incoming
 * payloads before business logic or database persistence occurs.
 *
 * It is reused for OpenAPI generation to ensure documentation remains
 * aligned with runtime validation.
 *
 * Note: This is separate from the MongoDB result model schema, which
 * defines data persistence structure rather than API input validation.
 */

import Joi from "joi";

export const createResultSchema = Joi.object({
  mrn: Joi.string().trim().max(32).required(),

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
});