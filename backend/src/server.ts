/**
 * src/server.ts
 *
 * Entry point for the CareModel Hub backend.
 * This file is responsible for:
 * creating the Hapi server, loading environment variables and HTTP server
 */

import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";

import { openApiSpec } from "./openapi/openapi.js";
import { validateJwt } from "./api/jwt-utils.js";
import { connectDb } from "./models/db.js";
import { apiRoutes } from "./api-routes.js";



/**
 * Create and start the server
 */
async function startServer() {
  // Create a Hapi server instance
  const corsOrigins =
  process.env.CORS_ORIGIN?.split(",").map(o => o.trim()) ?? [];

  const server = Hapi.server({
    port: Number(process.env.PORT) || 4000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: corsOrigins.length > 0 ? corsOrigins : ["*"],
        credentials: true,
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
  
  if (process.env.NODE_ENV !== "production") {
  server.route({
      method: "GET",
      path: "/documentation",
      options: { auth: false },
      handler: (request, h) => {
        return h.response(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>CMH API Docs</title>
              <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
            </head>
            <body>
              <div id="swagger-ui"></div>

              <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
              <script>
                const ui = SwaggerUIBundle({
                  spec: ${JSON.stringify(openApiSpec)},
                  dom_id: '#swagger-ui',

                  // Store token after login
                  responseInterceptor: async (response) => {
                    try {
                      const url = response?.config?.url || "";

                      if (url.includes("/api/users/login")) {
                        const data = response?.data;

                        if (data && data.token) {
                          localStorage.setItem("cmh_token", data.token);
                          console.log("JWT stored automatically");
                        }
                      }
                    } catch (err) {
                      console.error("Token extraction failed", err);
                    }

                    return response;
                  },

                  // Attach token to all future requests
                  requestInterceptor: (req) => {
                    const token = localStorage.getItem("cmh_token");
                    if (token) {
                      req.headers.Authorization = "Bearer " + token;
                    }
                    return req;
                  }
                });
              </script>
            </body>
          </html>
        `).type("text/html");
      }
    });

}




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