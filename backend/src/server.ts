/**
 * src/server.ts
 *
 * Entry point for the CareModel Hub backend.
 * This file is responsible for:
 * creating the Hapi server, loading environment variables and HTTP server
 */

import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import dotenv from "dotenv";

import { validateJwt } from "./api/jwt-utils.js";
import { connectDb } from "./models/db.js";
import { apiRoutes } from "./api-routes.js";

// Load variables from .env into process.env
dotenv.config();

/**
 * Create and start the server
 */
async function startServer() {
  // Create a Hapi server instance
  const server = Hapi.server({
    port: Number(process.env.PORT) || 4000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"], // TODO: lock down in production
      },
    },
  });

  // Register plugins FIRST
  await server.register(Jwt);

  // Configure authentication AFTER plugin registration
  server.auth.strategy("jwt", "jwt", {
    keys: process.env.JWT_SECRET!,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
    },
    validate: validateJwt,
  });

  // JWT required by default
  server.auth.default("jwt");

  // Health check route (no auth)
  server.route({
    method: "GET",
    path: "/health",
    options: { auth: false },
    handler: async () => ({
      status: "ok",
      service: "caremodelhub-backend",
      timestamp: new Date().toISOString(),
    }),
  });

  // API routes
  server.route(apiRoutes);

  // Connect to database
  await connectDb("mongo");

  // Start server LAST
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
}

/**
 * Global startup error handling
 */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled startup error:", err);
  process.exit(1);
});

// Start application
startServer();