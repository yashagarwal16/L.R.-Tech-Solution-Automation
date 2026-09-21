import mongoose, { Document, Schema } from "mongoose";

export interface IProjectAssignment extends Document {
  projectId: string;
  projectName: string;
  assigneeId: string;
  assigneeName: string;
  assignedByRole: string;
  assignedByEmail: string;
  createdAt: Date;
}

const ProjectAssignmentSchema = new Schema<IProjectAssignment>({
  projectId: { type: String, required: true, index: true },
  projectName: { type: String, required: true, maxlength: 160 },
  assigneeId: { type: String, required: true, maxlength: 120 },
  assigneeName: { type: String, required: true, maxlength: 120 },
  assignedByRole: { type: String, required: true },
  assignedByEmail: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.ProjectAssignment || mongoose.model<IProjectAssignment>("ProjectAssignment", ProjectAssignmentSchema);
