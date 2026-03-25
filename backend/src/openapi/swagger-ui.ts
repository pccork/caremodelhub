export function renderSwaggerUI(): string {
  return `
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
            url: "/openapi.json",
            dom_id: "#swagger-ui",
            persistAuthorization: true
          });
        </script>
      </body>
    </html>
  `;
}