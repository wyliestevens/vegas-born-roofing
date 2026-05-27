import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "owner" | "editor";
  passwordHash: string;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CredentialsFile {
  users: AdminUser[];
}

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  mustChangePassword: boolean;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const COOKIE_NAME = "vbr_admin";
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "vbr-dev-secret-change-in-production"
);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_OWNER = process.env.GITHUB_OWNER || "wyliestevens";
const GITHUB_REPO_NAME = process.env.GITHUB_REPO || "vegas-born-roofing";
const GITHUB_REPO = `${GITHUB_OWNER}/${GITHUB_REPO_NAME}`;
const CREDENTIALS_PATH = "data/admin/credentials.json";

/* ------------------------------------------------------------------ */
/*  Cookie config                                                      */
/* ------------------------------------------------------------------ */

export const sessionCookieConfig = {
  name: COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

/* ------------------------------------------------------------------ */
/*  Credentials - load / save via GitHub API                           */
/* ------------------------------------------------------------------ */

let cachedSha: string | null = null;

export async function loadCredentials(): Promise<CredentialsFile> {
  if (!GITHUB_TOKEN) {
    return getDefaultCredentials();
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${CREDENTIALS_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return getDefaultCredentials();
    }

    const data = await res.json();
    cachedSha = data.sha;
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return JSON.parse(content) as CredentialsFile;
  } catch {
    return getDefaultCredentials();
  }
}

export async function saveCredentials(creds: CredentialsFile): Promise<void> {
  if (!GITHUB_TOKEN) {
    console.warn("[auth] No GITHUB_TOKEN - credentials not persisted.");
    return;
  }

  const content = Buffer.from(JSON.stringify(creds, null, 2)).toString("base64");

  await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${CREDENTIALS_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update admin credentials",
        content,
        ...(cachedSha ? { sha: cachedSha } : {}),
      }),
    }
  );
}

function getDefaultCredentials(): CredentialsFile {
  return {
    users: [
      {
        id: "wylie",
        email: "wylie@aipeakbiz.com",
        name: "Wylie Stevens",
        role: "super_admin",
        passwordHash: "$2b$10$4p/siHddv7a/MzyBkPmRqemJcGrc1JarKnLOeIjzbjBWSpPgR9chK",
        mustChangePassword: false,
        createdAt: "2026-05-27T00:00:00Z",
        updatedAt: "2026-05-27T00:00:00Z",
      },
      {
        id: "rich",
        email: "rich@vegasbornroofing.com",
        name: "Rich Friesz",
        role: "owner",
        passwordHash: "$2b$10$4p/siHddv7a/MzyBkPmRqemJcGrc1JarKnLOeIjzbjBWSpPgR9chK",
        mustChangePassword: true,
        createdAt: "2026-05-27T00:00:00Z",
        updatedAt: "2026-05-27T00:00:00Z",
      },
      {
        id: "jodd",
        email: "jodd@vegasbornroofing.com",
        name: "Jodd Friesz",
        role: "owner",
        passwordHash: "$2b$10$4p/siHddv7a/MzyBkPmRqemJcGrc1JarKnLOeIjzbjBWSpPgR9chK",
        mustChangePassword: true,
        createdAt: "2026-05-27T00:00:00Z",
        updatedAt: "2026-05-27T00:00:00Z",
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  User lookup                                                        */
/* ------------------------------------------------------------------ */

export function findUser(
  creds: CredentialsFile,
  email: string
): AdminUser | undefined {
  return creds.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function findUserById(
  creds: CredentialsFile,
  id: string
): AdminUser | undefined {
  return creds.users.find((u) => u.id === id);
}

/* ------------------------------------------------------------------ */
/*  Password                                                           */
/* ------------------------------------------------------------------ */

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

/* ------------------------------------------------------------------ */
/*  Session JWT                                                        */
/* ------------------------------------------------------------------ */

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Helper: read session from request cookies                          */
/* ------------------------------------------------------------------ */

export function getSessionCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
  );
  return match ? match[1] : null;
}
