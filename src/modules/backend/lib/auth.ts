/**
 * Auth abstraction layer.
 * When real Clerk keys are set, this re-exports Clerk components.
 * When running with mock keys, it exports lightweight stubs so the app
 * doesn't crash during local development / visual testing.
 */

export const hasRealClerkKey =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_") &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("mock")
