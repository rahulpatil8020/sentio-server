import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "1d";
const REFRESH_TOKEN_EXPIRY = "30d";

interface TokenPayload {
  userId: string | unknown;
  email: string | unknown;
  iat?: number; // Issued At
  exp?: number; // Expiration Time
}

// ---------------------------
// Sign Access Token
// ---------------------------
export const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// ---------------------------
// Verify Access Token
// ---------------------------
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

// ---------------------------
// Sign Refresh Token
// ---------------------------
export const signRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// ---------------------------
// Verify Refresh Token
// ---------------------------
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as TokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
