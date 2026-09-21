import mongoose, { Document, Schema } from "mongoose";
export interface IOrder extends Document { name: string; email: string; phone?: string; service?: string; deadline?: string; details?: string; createdAt: Date; }
const schema = new Schema<IOrder>({ name: { type: String, required: true }, email: { type: String, required: true, lowercase: true }, phone: String, service: String, deadline: String, details: String }, { timestamps: true });
export default mongoose.models.Order || mongoose.model<IOrder>("Order", schema);
