/**
 * @vitest-environment node
 */
import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode("development-secret-key");
const COOKIE_NAME = "auth-token";

vi.mock("server-only", () => ({}));

const mockCookies = {
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookies)),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("createSession creates a valid JWT token and sets cookie", async () => {
  const { createSession } = await import("@/lib/auth");

  const userId = "user-123";
  const email = "test@example.com";

  await createSession(userId, email);

  expect(mockCookies.set).toHaveBeenCalledTimes(1);
  const [cookieName, token, options] = mockCookies.set.mock.calls[0];

  expect(cookieName).toBe(COOKIE_NAME);
  expect(typeof token).toBe("string");
  expect(options.httpOnly).toBe(true);
  expect(options.sameSite).toBe("lax");
  expect(options.path).toBe("/");
  expect(options.expires).toBeInstanceOf(Date);
});

test("createSession sets secure flag in production", async () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";

  vi.resetModules();
  const { createSession } = await import("@/lib/auth");
  await createSession("user-123", "test@example.com");

  const [, , options] = mockCookies.set.mock.calls[0];
  expect(options.secure).toBe(true);

  process.env.NODE_ENV = originalEnv;
});

test("createSession sets secure flag to false in development", async () => {
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";

  vi.resetModules();
  const { createSession } = await import("@/lib/auth");
  await createSession("user-123", "test@example.com");

  const [, , options] = mockCookies.set.mock.calls[0];
  expect(options.secure).toBe(false);

  process.env.NODE_ENV = originalEnv;
});

test("createSession creates token with correct expiration (7 days)", async () => {
  const { createSession } = await import("@/lib/auth");

  const now = Date.now();
  await createSession("user-123", "test@example.com");

  const [, , options] = mockCookies.set.mock.calls[0];
  const expires = options.expires as Date;
  const expiresTime = expires.getTime();

  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const expectedExpiry = now + sevenDaysInMs;

  expect(expiresTime).toBeGreaterThanOrEqual(expectedExpiry - 1000);
  expect(expiresTime).toBeLessThanOrEqual(expectedExpiry + 1000);
});

test("createSession includes user data in JWT payload", async () => {
  const { createSession } = await import("@/lib/auth");

  const userId = "user-456";
  const email = "jane@example.com";

  await createSession(userId, email);

  const [, token] = mockCookies.set.mock.calls[0];
  const { payload } = await jwtVerify(token, JWT_SECRET);

  expect(payload.userId).toBe(userId);
  expect(payload.email).toBe(email);
  expect(payload.expiresAt).toBeDefined();
});

test("createSession creates a token that can be verified", async () => {
  const { createSession } = await import("@/lib/auth");

  const userId = "user-789";
  const email = "john@example.com";

  await createSession(userId, email);

  const [, token] = mockCookies.set.mock.calls[0];

  const { payload } = await jwtVerify(token, JWT_SECRET);

  expect(payload).toBeDefined();
  expect(payload.userId).toBe(userId);
  expect(payload.email).toBe(email);
  expect(payload.exp).toBeDefined();
  expect(payload.iat).toBeDefined();
});
