/**
 * MongoDB connection logic.
 */

import mongoose from "mongoose";
import type { Db } from "../db.js";
import { userStore } from "./user-store.js";
import { resultStore } from "./result-store.js";
import { auditStore } from "./audit-store.js";

export async function connectMongo(db: Db): Promise<void> {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI not set in environment");
  }

  // mongoose setting
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri);

    console.log(" MongoDB connected");
    console.log(` Database: ${mongoose.connection.name}`);
    console.log(` Host: ${mongoose.connection.host}`);

    if (uri.startsWith("mongodb://127.0.0.1")) {
      console.log(" Using local MongoDB");
    } else if (uri.startsWith("mongodb+srv://")) {
      console.log(" Using MongoDB Atlas");
    }

    // Attach stores AFTER successful connection
    db.userStore = userStore;
    db.resultStore = resultStore;
    db.auditStore = auditStore;

    // ensure the listerner is registered after a successful connection
    mongoose.connection.on("disconnected", () => {
      console.warn(" MongoDB disconnected");
    });

  } catch (err) {
    console.error(" MongoDB connection error", err);
    throw err; // rather than exit process with local devOP, this allow deployment such as Render to handles crashes and restart
  }
}
