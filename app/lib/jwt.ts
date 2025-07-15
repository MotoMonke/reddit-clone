import { SignJWT, jwtVerify } from "jose";
import { getUserById } from "./db";
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}
const secret = new TextEncoder().encode(JWT_SECRET);
export type JwtPayload = {
  [key: string]: unknown;
};

export async function signToken(payload: JwtPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(secret);

  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    const id = payload.userId as number;
    const userCheck = await getUserById(id);
    if(userCheck===null){
      throw new Error('no user with such id in database');
    }
    console.log(payload);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
