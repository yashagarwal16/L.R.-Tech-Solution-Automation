import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "../../../../lib/auth-session";
import { workspaceStore, WorkspaceUser } from "../../../../lib/workspace-store";
import dbConnect from "../../../../lib/mongodb";
import UserProfile from "../../../../models/UserProfile";

function cleanUrl(value: unknown) { const url = typeof value === "string" ? value.trim().slice(0, 300) : ""; return url && /^https:\/\//i.test(url) ? url : ""; }
async function persistProfile(profile: typeof workspaceStore.users[number]) { try { await Promise.race([dbConnect(), new Promise((_, reject) => setTimeout(() => reject(new Error("database timeout")), 1500))]); await UserProfile.findOneAndUpdate({ organizationId: "default-org", email: profile.email }, { $set: { name: profile.name, role: profile.role, department: profile.department, team: profile.team, title: profile.title, status: profile.status, avatar: profile.avatar, bio: profile.bio, links: profile.links } }, { upsert: true, setDefaultsOnInsert: true }); } catch { /* Development fallback remains available when MongoDB is not running. */ } }
function profileForSession(session: { email: string; role: string }): WorkspaceUser {
  const existing = workspaceStore.users.find((user) => user.email.toLowerCase() === session.email.toLowerCase());
  if (existing) return existing;
  const name = session.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const profile: WorkspaceUser = { id: `env_${session.role}`, name, email: session.email, role: session.role as WorkspaceUser["role"], department: "General", team: "Workspace", title: session.role === "owner" ? "Owner" : "Workspace member", status: "active" };
  workspaceStore.users.push(profile);
  return profile;
}

export async function GET(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get("lumen_session")?.value);
  if (!session) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  const profile = profileForSession(session);
  const { passwordHash, ...safeProfile } = profile;
  return NextResponse.json({ profile: safeProfile });
}

export async function PATCH(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get("lumen_session")?.value);
  if (!session) return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  const profile = profileForSession(session);
  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : profile.name;
  if (name.length < 2) return NextResponse.json({ message: "Your name must contain at least two characters." }, { status: 400 });
  const avatar = typeof body.avatar === "string" && body.avatar.length <= 1_500_000 ? body.avatar : profile.avatar;
  if (avatar && avatar.startsWith("data:") && !/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(avatar)) return NextResponse.json({ message: "Profile photo must be a PNG, JPG, WEBP, or GIF." }, { status: 400 });
  profile.name = name;
  profile.title = typeof body.title === "string" ? body.title.trim().slice(0, 120) : profile.title;
  profile.department = typeof body.department === "string" ? body.department.trim().slice(0, 120) : profile.department;
  profile.team = typeof body.team === "string" ? body.team.trim().slice(0, 120) : profile.team;
  profile.bio = typeof body.bio === "string" ? body.bio.trim().slice(0, 1200) : profile.bio;
  profile.avatar = avatar;
  const links = body.links && typeof body.links === "object" ? body.links : {};
  profile.links = { website: cleanUrl(links.website), linkedin: cleanUrl(links.linkedin), github: cleanUrl(links.github), instagram: cleanUrl(links.instagram) };
  await persistProfile(profile);
  const { passwordHash, ...safeProfile } = profile;
  return NextResponse.json({ profile: safeProfile });
}
