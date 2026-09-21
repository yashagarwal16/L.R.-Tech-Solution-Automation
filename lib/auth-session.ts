import { workspaceStore } from "./workspace-store";
import { isConfigured } from "./env";

type SessionClaims = { role: string; email: string; exp: number };

const encoder = new TextEncoder();

function encode(value: string | Uint8Array) {
  const bytes = typeof value === "string" ? encoder.encode(value) : value;
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(normalized), (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function signature(payload: string) {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!isConfigured(secret)) return null;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return encode(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload))));
}

export async function createSessionToken(role: string, email: string) {
  const payload = encode(JSON.stringify({ role, email, exp: Date.now() + 8 * 60 * 60 * 1000 } satisfies SessionClaims));
  const signed = await signature(payload);
  if (!signed) throw new Error("AUTH_SESSION_SECRET must be configured before authentication is enabled.");
  return `${payload}.${signed}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return null;
  const [payload, providedSignature] = token.split(".");
  if (!payload || !providedSignature) return null;
  const expectedSignature = await signature(payload);
  if (!expectedSignature || expectedSignature !== providedSignature) return null;
  try {
    const claims = JSON.parse(decode(payload)) as SessionClaims;
    if (claims.exp <= Date.now()) return null;
    const profile = workspaceStore.users.find((user) => user.email.toLowerCase() === claims.email.toLowerCase());
    return profile && profile.status !== "active" ? null : claims;
  } catch { return null; }
}
