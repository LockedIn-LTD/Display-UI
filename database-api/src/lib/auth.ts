import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret";
const TTL_HOURS = Number(process.env.TOKEN_TTL_HOURS || "24");

export function signJwt(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: `${TTL_HOURS}h` });
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, SECRET) as T;
}
