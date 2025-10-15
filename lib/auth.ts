import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export interface AuthUser {
  id: string;
  email?: string;
}

export function getUserFromCookies(): AuthUser | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { id?: string; email?: string };
    if (!decoded?.id) {
      return null;
    }
    return { id: decoded.id, email: decoded.email };
  } catch (_) {
    return null;
  }
}

export function getUserFromAuthHeader(authorization?: string | null): AuthUser | null {
  if (!authorization) {
    return null;
  }
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id?: string; email?: string };
    if (!decoded?.id) {
      return null;
    }
    return { id: decoded.id, email: decoded.email };
  } catch (_) {
    return null;
  }
}


