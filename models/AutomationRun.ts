import mongoose, { Document, Schema } from "mongoose";

export interface IAutomationRun extends Document {
  workflowId: string;
  trigger: string;
  resourceType: string;
  resourceId: string;
  status: "queued" | "completed" | "failed";
  details: Record<string, string>;
  createdAt: Date;
}

const AutomationRunSchema = new Schema<IAutomationRun>({
  workflowId: { type: String, required: true, index: true },
  trigger: { type: String, required: true },
  resourceType: { type: String, required: true },
  resourceId: { type: String, required: true },
  status: { type: String, enum: ["queued", "completed", "failed"], default: "queued" },
  details: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

AutomationRunSchema.index({ createdAt: -1 });

export default mongoose.models.AutomationRun || mongoose.model<IAutomationRun>("AutomationRun", AutomationRunSchema);
