import mongoose, { Document, Schema } from "mongoose";
export interface ISubscriber extends Document { email: string; createdAt: Date; }
const schema = new Schema<ISubscriber>({ email: { type: String, required: true, lowercase: true, unique: true } }, { timestamps: true });
export default mongoose.models.Subscriber || mongoose.model<ISubscriber>("Subscriber", schema);
