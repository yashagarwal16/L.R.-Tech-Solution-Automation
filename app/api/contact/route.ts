import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ContactInquiry from "@/models/ContactInquiry";
import { recordAutomationRun } from "@/lib/automation";
import { sendContactNotification } from "@/lib/email";

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = text(body.name, 120);
    const email = text(body.email, 240).toLowerCase();
    const company = text(body.company, 160);
    const need = text(body.need, 100);
    const message = text(body.message, 5000);

    if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Please provide a name, valid work email, and message." }, { status: 400 });
    }

    await dbConnect();
    const inquiry = await ContactInquiry.create({ name, email, company, need, message });
    await recordAutomationRun({ workflowId: "lead-intake-routing", trigger: "contact.inquiry.created", resourceType: "contact-inquiry", resourceId: inquiry._id.toString(), details: { need: need || "unspecified", company: company || "unknown", nextAction: "owner-follow-up" } });
    let emailSent = false;
    try {
      emailSent = (await sendContactNotification({ name, email, company, need, message, inquiryId: inquiry._id.toString() })).sent;
    } catch (error) {
      console.error("Contact enquiry was saved, but notification email failed.", error instanceof Error ? error.message : "Unknown SMTP error");
    }
    return NextResponse.json({ success: true, emailSent, inquiryId: inquiry._id.toString(), recipient: "L. R. Tech Solutions intake workspace" }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "We could not save your message. Please try again or contact the team directly." }, { status: 500 });
  }
}
