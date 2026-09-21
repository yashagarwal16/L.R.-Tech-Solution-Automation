import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./lib_mongodb";
import Subscriber from "./models/Subscriber";
export async function POST(request: NextRequest) { try { const body = await request.json(); const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""; if (!email.includes("@")) return NextResponse.json({ message: "A valid email is required." }, { status: 400 }); await dbConnect(); await Subscriber.updateOne({ email }, { email }, { upsert: true }); return NextResponse.json({ ok: true }); } catch { return NextResponse.json({ message: "Subscription could not be saved right now." }, { status: 503 }); } }
