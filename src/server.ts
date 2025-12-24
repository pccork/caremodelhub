/**
 * src/server.ts
 *
 * Entry point for the CareModel Hub backend.
 * This file is responsible for:
 * creating the Hapi server, loading environment variables and HTTP server
 */

import Hapi from "@hapi/hapi";
import dotenv from "dotenv";

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
        origin: ["*"], // allow all origins for now (lock down later)
      },
    },
  });

  /**
   * Basic health check route
   * Verify the server is running
   */
  server.route({
    method: "GET",
    path: "/health",
    options: {
      auth: false, // no auth required
    },
    handler: async () => {
      return {
        status: "ok",
        service: "caremodelhub-backend",
        timestamp: new Date().toISOString(),
      };
    },
  });

  // Start the server
  await server.start();

  console.log(` Server running at: ${server.info.uri}`);
}

/**
 * Catch startup errors
 */
process.on("unhandledRejection", (err) => {
  console.error(" Unhandled error:", err);
  process.exit(1);
});

// Start the application
startServer();
