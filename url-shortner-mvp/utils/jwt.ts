import crypto from "node:crypto";

interface JwtHeader {
  alg: "HS256";
  typ: "JWT";
}

interface JwtPayload {
  sub: string;
  email?: string;
  roles?: string[];
  iat: number;
  exp: number;
}

function base64Url(source: string | Buffer): string {
  const buffer = typeof source === "string" ? Buffer.from(source) : source;
  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export const genarateToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing.");
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);

  const header: JwtHeader = {
    alg: "HS256",
    typ: "JWT",
  };
  const payload: JwtPayload = {
    sub: userId,
    email: email,
    iat: nowInSeconds,
    exp: nowInSeconds + 60 * 60 * 24,
  };

  const encodedHeaders = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));

  const encodedTokenData = `${encodedHeaders}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedTokenData)
    .digest("base64");

  const encodedSignature = base64Url(signature);
  return `${encodedTokenData}.${encodedSignature}`;
};
