import mongoose, { Document, Schema } from "mongoose";
import type { WorkspaceRole } from "../lib/access";

export interface IUserProfile extends Document {
  organizationId: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  department: string;
  team: string;
  title: string;
  status: "active" | "invited" | "inactive";
  passwordHash?: string;
  avatar?: string;
  bio?: string;
  links?: { website?: string; linkedin?: string; github?: string; instagram?: string };
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>({
  organizationId: { type: String, required: true, index: true, default: "default-org" },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 240 },
  role: { type: String, enum: ["owner", "manager", "employee", "finance", "hr", "client"], required: true },
  department: { type: String, trim: true, maxlength: 120 },
  team: { type: String, trim: true, maxlength: 120 },
  title: { type: String, trim: true, maxlength: 120 },
  status: { type: String, enum: ["active", "invited", "inactive"], default: "active" },
  passwordHash: { type: String, select: false },
  avatar: { type: String, trim: true, maxlength: 240 },
  bio: { type: String, trim: true, maxlength: 1200 },
  links: { website: String, linkedin: String, github: String, instagram: String },
}, { timestamps: true });

UserProfileSchema.index({ organizationId: 1, email: 1 }, { unique: true });

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
