import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve directory (ESM-safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load backend/.env
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// DEBUG (temporary, keep for now)
console.log("KFRE_SERVICE_URL =", process.env.KFRE_SERVICE_URL);

// Start server
import "./server.js";
