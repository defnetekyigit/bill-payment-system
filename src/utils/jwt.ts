import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export const generateToken = (payload: any, expiresIn = "1h") => {
  return jwt.sign(payload, SECRET, { expiresIn: expiresIn as any });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};
