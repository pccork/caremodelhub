import j2sModule from "joi-to-swagger";
import { createResultSchema } from "../schemas/result.schema.js";
import type { OpenAPIV3 } from "openapi-types";
const j2s = (j2sModule as any).default ?? j2sModule;

const conversion = j2s(createResultSchema);
const resultRequestSchema = conversion.swagger;
export const openApiSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",

  info: {
    title: "CareModel Hub API",
    version: "1.0.0",
    description: "CMH Clinical Decision Support Backend",
  },

  servers: [
    {
      url: "http://localhost:4000",
    },
  ],

  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "Service is healthy",
          },
        },
      },
    },

    "/api/users/login": {
        post: {
            summary: "User login",
            tags: ["users"],
            requestBody: {
            required: true,
            content: {
                "application/json": {
                schema: {
                    type: "object",
                    properties: {
                    email: { type: "string" },
                    password: { type: "string" }
                    },
                    required: ["email", "password"]
                }
                }
            }
            },
            responses: {
            "200": {
                description: "JWT token returned",
                content: {
                "application/json": {
                    schema: {
                    type: "object",
                    properties: {
                        token: { type: "string" }
                    }
                    }
                }
                }
            },
            "401": {
                description: "Invalid credentials"
            }
            }
        }
        
    },

    "/api/audit": {
      get: {
        summary: "Retrieve audit records",
        description: "Returns audit logs. Requires role: admin or scientist.",
        tags: ["audit"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "mrn",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Filter audit records by MRN"
          },
          {
            name: "specimenNo",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Filter audit records by specimen number"
          },
          {
            name: "userId",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Filter audit records by user ID"
          }
        ],
        responses: {
          "200": {
            description: "List of audit records"
          },
          "401": {
            description: "Missing or invalid JWT"
          },
          "403": {
            description: "Valid JWT but insufficient role"
          }
        }
      }
    },



    "/api/results": {
      post: {
        summary: "Create calculation result.  Requires role: user only. ",
        tags: ["results"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: resultRequestSchema as OpenAPIV3.SchemaObject
            }
          }
        },
        responses: {
          "201": {
            description: "Result created",
            content: {
              "application/json": {
                schema: {
                  type: "object"
                }
              }
            }
          },
          "400": { description: "Invalid payload" },
          "401": { description: "Unauthorized" },
          "403": { description: "Insufficient role" }
        }
      },

      get: {
        summary: "List results. All role could list results ",
        tags: ["results"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "List of results" },
          "401": { description: "Missing or invalid JWT token" },
          "403": { description: "Valid JWT but insufficient role" }
        },
      },

    },
  },

  // JWT secruity for API documentation
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  
};