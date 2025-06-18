import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "movieBookingweb";

export interface DecodedUser {
  id: string;
}

export function verifyToken(authHeader: string | null): DecodedUser {
  if (!authHeader) {
    throw new Error("Authorization header missing");
  }

  const token = authHeader;
  const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser;

  if (!decoded?.id) {
    throw new Error("Invalid token structure");
  }

  return decoded;
}
