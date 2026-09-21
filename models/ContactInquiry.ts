import mongoose, { Document, Schema } from "mongoose";

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  company?: string;
  need?: string;
  message: string;
  status: "new" | "reviewed" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 240 },
    company: { type: String, trim: true, maxlength: 160 },
    need: { type: String, trim: true, maxlength: 100 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: ["new", "reviewed", "archived"], default: "new" },
  },
  { timestamps: true },
);

ContactInquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.ContactInquiry || mongoose.model<IContactInquiry>("ContactInquiry", ContactInquirySchema);
