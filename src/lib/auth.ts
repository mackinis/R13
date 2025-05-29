
// import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

// // Helper function to get and encode the secret key for our custom session token
// async function getKey() {
//   const secret = process.env.AUTH_COOKIE_SECRET;
//   if (!secret || typeof secret !== 'string' || secret.trim() === '') {
//     const errorMessage = '[AuthLib/getKey] CRITICAL FATAL ERROR: AUTH_COOKIE_SECRET environment variable is NOT SET, EMPTY, or NOT A STRING. Custom session token operations WILL FAIL. Please set this in your .env file and RESTART THE SERVER.';
//     console.error("==================================================================================");
//     console.error(errorMessage);
//     console.error("ACTION REQUIRED: Set AUTH_COOKIE_SECRET (as a non-empty string of sufficient length) in .env and RESTART your Next.js server.");
//     console.error("==================================================================================");
//     throw new Error('AUTH_COOKIE_SECRET_MISSING_OR_INVALID');
//   }
//   // console.log('[AuthLib/getKey] AUTH_COOKIE_SECRET is present for an operation.');
//   return new TextEncoder().encode(secret);
// }

// interface CustomSessionJWTPayload extends JWTPayload {
//   email: string;
//   sub?: string; // Firebase User ID
// }

// // Encrypts the payload for our custom session token
// export async function encrypt(payload: CustomSessionJWTPayload): Promise<string> {
//   console.log('[AuthLib/encrypt] Attempting to encrypt payload for custom session token. Email:', payload.email, 'Sub:', payload.sub);
//   let key;
//   try {
//     key = await getKey();
//     console.log('[AuthLib/encrypt] Successfully obtained key for encryption.');
//   } catch (error: any) {
//     console.error("[AuthLib/encrypt] CRITICAL: Failed to get key for encryption:", error.message);
//     throw new Error(`ENCRYPTION_FAILED_KEY_ERROR: ${error.message}`);
//   }

//   try {
//     const token = await new SignJWT(payload)
//       .setProtectedHeader({ alg: 'HS256' })
//       .setIssuedAt()
//       .setExpirationTime('24h')
//       .sign(key);
//     console.log('[AuthLib/encrypt] Custom session token encrypted successfully.');
//     return token;
//   } catch (error: any) {
//     console.error("[AuthLib/encrypt] Encryption error (SignJWT failed). Error:", error);
//     throw new Error(`ENCRYPTION_FAILED_SIGNING_ERROR: ${error.message}`);
//   }
// }

// // Verifies our custom session token
// export async function verifyAuth(token: string): Promise<CustomSessionJWTPayload | null> {
//   console.log('[AuthLib/verifyAuth] Attempting to verify custom session token (first 10 chars):', token ? token.substring(0, 10) + "..." : "null_or_empty_token");
//   if (!token) {
//     console.warn("[AuthLib/verifyAuth] verifyAuth called with no token or empty token.");
//     return null;
//   }

//   let key;
//   try {
//     key = await getKey();
//     // console.log("[AuthLib/verifyAuth] Successfully obtained key for verification."); // Can be noisy, enable if needed
//   } catch (error: any) {
//       console.error("[AuthLib/verifyAuth] CRITICAL: Failed to get key for verification (AUTH_COOKIE_SECRET issue):", error.message);
//       // This indicates a fundamental problem with AUTH_COOKIE_SECRET, verification cannot proceed.
//       return null;
//   }

//   try {
//     const { payload } = await jwtVerify<CustomSessionJWTPayload>(token, key, {
//       algorithms: ['HS256'],
//     });
//     console.log("[AuthLib/verifyAuth] Custom session token VERIFIED SUCCESSFULLY. Payload email:", payload.email, "Payload sub:", payload.sub);
//     if (!payload.email || typeof payload.email !== 'string') {
//         console.error("[AuthLib/verifyAuth] VERIFICATION WARNING: Token payload is missing 'email' or it's not a string. Payload:", payload);
//         return null; // Invalid payload structure
//     }
//     return payload;
//   } catch (err: any) {
//     console.error('----------------------------------------------------------------------');
//     console.error('[AuthLib/verifyAuth] CUSTOM SESSION TOKEN VERIFICATION FAILED. Details below:');
//     console.error(`[AuthLib/verifyAuth] Token being verified (first 20 chars): ${token ? token.substring(0,20) : "N/A"}...`);
//     console.error(`[AuthLib/verifyAuth] Error Code: ${err.code}, Error Name: ${err.name}, Message: ${err.message}`);

//     if (err.message === 'AUTH_COOKIE_SECRET_MISSING_OR_INVALID') {
//         console.error('[AuthLib/verifyAuth] Critical Cause: AUTH_COOKIE_SECRET was missing or invalid during key retrieval.');
//     } else if (err.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
//         console.error('[AuthLib/verifyAuth] Cause: Signature verification failed. Common Reason: AUTH_COOKIE_SECRET used for signing is DIFFERENT from the one used here OR server was not RESTARTED after .env change.');
//     } else if (err.code === 'ERR_JWT_EXPIRED') {
//         console.error('[AuthLib/verifyAuth] Cause: Token has expired.');
//     } else if (err.code === 'ERR_JWS_INVALID' || err.code === 'ERR_JWT_MALFORMED') {
//         console.error('[AuthLib/verifyAuth] Cause: JWS is invalid or JWT is malformed.');
//     } else {
//         console.error('[AuthLib/verifyAuth] Cause: An unexpected error occurred during verification:', err);
//     }
//     console.error('----------------------------------------------------------------------');
//     return null;
//   }
// }

// This file is largely no longer needed for the client-side Firebase Auth approach
// for /panel protection. Its contents are commented out.
// If you implement other server-side protected API routes that use custom JWTs,
// you might re-activate and adapt this code.
console.log("[AuthLib] Custom JWT functions are currently commented out as /panel uses client-side Firebase Auth check.");
