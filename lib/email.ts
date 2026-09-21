import nodemailer from "nodemailer";
import dns from "node:dns";
import { isConfigured } from "./env";

type ContactNotification = {
  name: string;
  email: string;
  company: string;
  need: string;
  message: string;
  inquiryId: string;
};

function recipients() {
  return [
    process.env.OWNER_NOTIFICATION_EMAIL,
    process.env.MANAGER_NOTIFICATION_EMAIL,
    ...(process.env.ADDITIONAL_NOTIFICATION_EMAILS ?? "").split(","),
  ].map((value) => value?.trim().toLowerCase()).filter((value): value is string => Boolean(value));
}

export async function sendContactNotification(inquiry: ContactNotification) {
  const user = process.env.SMTP_USER;
  const appPassword = process.env.SMTP_APP_PASSWORD;
  const to = [...new Set(recipients())];

  if (!isConfigured(user) || !isConfigured(appPassword) || !to.length) {
    console.warn("Contact notification email is not configured; enquiry was saved without sending email.");
    return { sent: false, configured: false };
  }

  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpAddress = (await dns.promises.lookup(smtpHost, { family: 4 })).address;
  const transporter = nodemailer.createTransport({
    host: smtpAddress,
    port: Number(process.env.SMTP_PORT || "465"),
    secure: process.env.SMTP_SECURE !== "false",
    tls: { servername: smtpHost },
    auth: { user, pass: appPassword },
  });

  await transporter.sendMail({
    from: { name: "L. R. TECH Website", address: user },
    to,
    replyTo: inquiry.email,
    subject: `L. R. Tech Solutions · New enquiry${inquiry.company ? ` from ${inquiry.company}` : ""}`,
    text: [
      "L. R. Tech Solutions · New website enquiry",
      "",
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Company: ${inquiry.company || "Not provided"}`,
      `Need: ${inquiry.need || "Not provided"}`,
      `Inquiry ID: ${inquiry.inquiryId}`,
      "",
      "Message:",
      inquiry.message,
    ].join("\n"),
    html: `
      <div style="margin:0;background:#f3f6f5;padding:32px 16px;font-family:Arial,sans-serif;color:#142337">
        <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #dce4e8;border-radius:18px;overflow:hidden">
          <div style="padding:26px 30px;background:#132234;color:#ffffff">
            <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#cfe875">L. R. Tech Solutions</div>
            <h1 style="margin:12px 0 0;font-size:28px;line-height:1.1;font-weight:600">A new conversation has arrived.</h1>
            <p style="margin:10px 0 0;color:#c6d4d7;font-size:14px">Website enquiry · ready for a human follow-up</p>
          </div>
          <div style="padding:28px 30px">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:10px 0;color:#718096;width:34%">Name</td><td style="padding:10px 0;font-weight:700">${escapeHtml(inquiry.name)}</td></tr>
              <tr><td style="padding:10px 0;color:#718096">Email</td><td style="padding:10px 0"><a href="mailto:${escapeHtml(inquiry.email)}" style="color:#436e95">${escapeHtml(inquiry.email)}</a></td></tr>
              <tr><td style="padding:10px 0;color:#718096">Company</td><td style="padding:10px 0">${escapeHtml(inquiry.company || "Not provided")}</td></tr>
              <tr><td style="padding:10px 0;color:#718096">Need</td><td style="padding:10px 0">${escapeHtml(inquiry.need || "Not provided")}</td></tr>
            </table>
            <div style="margin-top:20px;padding:18px;background:#f3f6f5;border-radius:12px">
              <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#718096;margin-bottom:8px">Message</div>
              <div style="font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(inquiry.message)}</div>
            </div>
            <p style="margin:22px 0 0;color:#718096;font-size:12px">Inquiry ID: ${escapeHtml(inquiry.inquiryId)} · Reply directly to this email to contact the visitor.</p>
          </div>
          <div style="padding:16px 30px;background:#eef5e4;color:#5d7430;font-size:12px">Make the next right decision · L. R. Tech Solutions</div>
        </div>
      </div>
    `,
  });

  return { sent: true, configured: true };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}
