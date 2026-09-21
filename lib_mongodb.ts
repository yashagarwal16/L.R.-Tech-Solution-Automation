import mongoose from "mongoose";
import { requiredEnv } from "./lib/env";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
declare global { var mongooseCache: Cache | undefined; }
const cached = global.mongooseCache ?? (global.mongooseCache = { conn: null, promise: null });
export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(requiredEnv("MONGODB_URI"), { bufferCommands: false });
  cached.conn = await cached.promise;
  return cached.conn;
}
