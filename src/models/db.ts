/**
 * Central database abstraction.
 * This allows swap MongoDB later between local and online*/
import { connectMongo } from "./mongo/connect.js";

export type Db = {
  // Stores will be attached here later
  userStore: any;
  resultStore: any;
};

// Singleton DB object
export const db: Db = {
  userStore: null,
  resultStore: null,
};

/**
 * Entry point for DB connection.
 * For now, only MongoDB is supported.
 */
export function connectDb(dbType: "mongo") {
  if (dbType === "mongo") {
    connectMongo(db);
  }
}
