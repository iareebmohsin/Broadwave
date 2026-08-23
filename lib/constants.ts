/**
 * @file lib/constants.ts
 * @description Shared application constants.
 *
 * Centralises magic numbers and limits so they can be reused across
 * server actions, components, and validation logic.
 */

/** Maximum allowed bio length in characters. */
export const BIO_MAX_LENGTH = 200;

// ---------------------------------------------------------------------------
// Environment variable name constants
// ---------------------------------------------------------------------------
// Centralised here so every module references the same string literal once.

/** Environment variable name for the LiveKit server API URL. */
export const ENV_LIVEKIT_API_URL = "LIVEKIT_API_URL";

/** Environment variable name for the LiveKit API key. */
export const ENV_LIVEKIT_API_KEY = "LIVEKIT_API_KEY";

/** Environment variable name for the LiveKit API secret. */
export const ENV_LIVEKIT_API_SECRET = "LIVEKIT_API_SECRET";

/** Environment variable name for the PostgreSQL connection string. */
export const ENV_DATABASE_URL = "DATABASE_URL";
