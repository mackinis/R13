
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { encrypt } from '@/lib/auth'; // Our custom JWT encryptor
import { JWTPayload, jwtVerify, importX509 } from 'jose'; // Changed importJWK to importX509

interface FirebaseJWTPayload extends JWTPayload {
  email?: string;
  email_verified?: boolean;
  user_id?: string; // Firebase uses user_id or sub
  sub?: string;
}

// Function to fetch Google's public keys for Firebase token verification
async function getGooglePublicKeys(): Promise<Map<string, CryptoKey>> {
  const publicKeysUrl = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
  console.log(`[API/firebase-session/getGooglePublicKeys] Attempting to fetch public keys from: ${publicKeysUrl}`);
  try {
    const response = await fetch(publicKeysUrl);
    console.log(`[API/firebase-session/getGooglePublicKeys] Fetch response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Failed to read error response body');
      console.error(`[API/firebase-session/getGooglePublicKeys] Failed to fetch public keys. Status: ${response.status}, StatusText: ${response.statusText}, Body: ${errorText}`);
      throw new Error(`Google public key fetch failed: ${response.statusText} (status ${response.status})`);
    }

    const keysJson = await response.json();
    console.log('[API/firebase-session/getGooglePublicKeys] Successfully fetched and parsed public keys JSON.');

    const publicKeys = new Map<string, CryptoKey>();
    if (typeof keysJson !== 'object' || keysJson === null) {
        console.error('[API/firebase-session/getGooglePublicKeys] Public keys JSON is not an object:', keysJson);
        throw new Error('Google public keys response is not in expected object format.');
    }

    for (const kid in keysJson) {
      const pemCertificate = keysJson[kid];
      if (typeof pemCertificate !== 'string') {
         console.error(`[API/firebase-session/getGooglePublicKeys] Public key for kid ${kid} is not a string (PEM format expected). Value:`, pemCertificate);
         // No need to throw here, just log and skip, or the loop will terminate.
         // Let's throw to be strict, as a malformed key is an issue.
         throw new Error(`Public key for kid ${kid} is not in expected PEM string format.`);
      }
      console.log(`[API/firebase-session/getGooglePublicKeys] Processing key for kid: ${kid}`);
      try {
        // Use importX509 for PEM certificates
        const publicKey = await importX509(pemCertificate, 'RS256'); 
        publicKeys.set(kid, publicKey);
        console.log(`[API/firebase-session/getGooglePublicKeys] Successfully imported public key for kid: ${kid}`);
      } catch (importError: any) {
        console.error(`[API/firebase-session/getGooglePublicKeys] Error importing public key (X509) for kid ${kid}:`, importError.message, importError.stack);
        throw new Error(`Failed to import public key for kid ${kid}: ${importError.message}`);
      }
    }

    if (publicKeys.size === 0) {
        console.error("[API/firebase-session/getGooglePublicKeys] No public keys were imported. The keysJson might be empty or all keys failed to import.");
        throw new Error("No public keys could be processed from Google's response.");
    }

    console.log('[API/firebase-session/getGooglePublicKeys] All public keys imported successfully.');
    return publicKeys;
  } catch (error: any) { // Catching 'any' because 'error' from try-catch can be anything
    console.error('[API/firebase-session/getGooglePublicKeys] Overall error in getGooglePublicKeys:', error.message, error.stack);
    // Re-throw with a consistent message if it's not already the desired one for the client.
    // The detailed error.message will be logged above.
    throw new Error('Could not fetch and process Google public keys for token verification.');
  }
}


export async function POST(request: NextRequest) {
  console.log('[API/firebase-session] Received POST request.');
  try {
    const requestBody = await request.json();
    const { idToken } = requestBody;
    console.log('[API/firebase-session] ID Token (first 20 chars):', idToken ? idToken.substring(0, 20) + "..." : "null_or_empty_token");


    if (!idToken) {
      console.warn('[API/firebase-session] ID token is missing in request body.');
      return NextResponse.json({ message: 'ID token is required.' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const authCookieSecret = process.env.AUTH_COOKIE_SECRET;

    console.log(`[API/firebase-session] ENV CHECK: ADMIN_EMAIL set: ${!!adminEmail}, NEXT_PUBLIC_FIREBASE_PROJECT_ID set: ${!!firebaseProjectId}, AUTH_COOKIE_SECRET set: ${!!authCookieSecret}`);


    if (!adminEmail) {
      console.error('[API/firebase-session] CRITICAL: ADMIN_EMAIL environment variable is not set.');
      return NextResponse.json({ message: 'Server configuration error (admin email).' }, { status: 500 });
    }
    if (!firebaseProjectId) {
      console.error('[API/firebase-session] CRITICAL: NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set.');
      return NextResponse.json({ message: 'Server configuration error (Firebase project ID).' }, { status: 500 });
    }
     if (!authCookieSecret) {
      console.error('[API/firebase-session] CRITICAL: AUTH_COOKIE_SECRET environment variable is not set.');
      return NextResponse.json({ message: 'Server configuration error (auth cookie secret).' }, { status: 500 });
    }

    let decodedToken: FirebaseJWTPayload | null = null;
    try {
      console.log('[API/firebase-session] Attempting to fetch and process Google public keys...');
      const publicKeys = await getGooglePublicKeys(); // This function now uses importX509
      console.log('[API/firebase-session] Google public keys processed. Verifying Firebase ID Token...');
      const { payload } = await jwtVerify(idToken, async (header) => {
        if (!header.kid) {
          console.error("[API/firebase-session] No 'kid' in token header during key lookup.");
          throw new Error("No 'kid' in token header");
        }
        const key = publicKeys.get(header.kid);
        if (!key) {
          console.error(`[API/firebase-session] No public key found for kid: ${header.kid}`);
          throw new Error(`No public key found for kid: ${header.kid}`);
        }
        return key;
      }, {
        issuer: `https://securetoken.google.com/${firebaseProjectId}`,
        audience: firebaseProjectId,
        algorithms: ['RS256'],
      });
      decodedToken = payload as FirebaseJWTPayload;
      console.log('[API/firebase-session] Firebase ID Token verified successfully. Decoded email:', decodedToken.email);
    } catch (error: any) {
      console.error('[API/firebase-session] Firebase ID Token verification failed. Error:', error.message, 'Code:', error.code, 'Stack:', error.stack);
      if (error.code === 'ERR_JWT_EXPIRED') {
        return NextResponse.json({ message: 'Firebase token has expired. Please log in again.' }, { status: 401 });
      }
      if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' || error.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
         return NextResponse.json({ message: 'Invalid Firebase token (verification failed).' }, { status: 401 });
      }
      // Fallback for other JWT or key-related errors caught here, including errors from getGooglePublicKeys
      return NextResponse.json({ message: `Failed to verify Firebase token: ${error.message || 'Unknown verification error'}` }, { status: 401 });
    }
    
    if (!decodedToken || !decodedToken.email) {
        console.error('[API/firebase-session] Decoded token is invalid or missing email. Decoded token:', decodedToken);
        return NextResponse.json({ message: 'Invalid token payload.' }, { status: 401 });
    }

    console.log(`[API/firebase-session] Comparing token email ("${decodedToken.email}") with ADMIN_EMAIL from env ("${adminEmail}").`);
    if (decodedToken.email !== adminEmail) {
      console.warn(`[API/firebase-session] Unauthorized access attempt: Email ${decodedToken.email} does not match ADMIN_EMAIL.`);
      return NextResponse.json({ message: 'Unauthorized: Email does not match admin email.' }, { status: 403 });
    }
    
    if (decodedToken.email_verified === false) {
        console.warn(`[API/firebase-session] Admin email ${decodedToken.email} is not verified in Firebase.`);
    }

    console.log('[API/firebase-session] Admin user authorized. Encrypting session payload...');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); 
    const sessionPayload = { email: decodedToken.email, sub: decodedToken.sub || decodedToken.user_id || 'unknown_sub', expires };
    
    const sessionToken = await encrypt(sessionPayload);
    console.log('[API/firebase-session] Custom admin session token encrypted. Setting cookie...');

    cookies().set('admin-session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires,
      path: '/',
      sameSite: 'lax',
    });
    console.log('[API/firebase-session] Custom admin session token created and cookie set for:', decodedToken.email);
    return NextResponse.json({ message: 'Session created successfully.' }, { status: 200 });

  } catch (error) {
    let errorMessage = 'An unexpected error occurred during session creation.';
    let errorDetails = error;

    if (error instanceof Error) {
      errorMessage = error.message;
      // Add more detailed logging for unexpected errors
      console.error('[API/firebase-session] UNEXPECTED ERROR in POST handler - Error Name:', error.name);
      console.error('[API/firebase-session] UNEXPECTED ERROR in POST handler - Error Message:', error.message);
      console.error('[API/firebase-session] UNEXPECTED ERROR in POST handler - Error Stack:', error.stack);
      errorDetails = { message: error.message, name: error.name }; // Avoid sending full stack to client
    } else if (typeof error === 'string') {
      errorMessage = error;
      errorDetails = { message: error };
    } else {
      // Handle cases where error is not an Error object or string
      console.error('[API/firebase-session] UNEXPECTED NON-ERROR OBJECT THROWN in POST handler:', error);
      errorDetails = { message: 'An unknown error structure was caught.' };
    }
    
    console.error('[API/firebase-session] CRITICAL UNEXPECTED ERROR in POST handler. Full details logged above. Sending generic error to client.');
    return NextResponse.json({ message: `Server error: ${errorMessage}` }, { status: 500 });
  }
}
