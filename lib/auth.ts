import * as jwt from "jsonwebtoken";

export const AUTH_COOKIE = "auth"; //kuki u kome se cuvaju tokeni
const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in env file");
}

//sadrzaj tokena
export type JwtUserClaims = {
  sub: string;
  email: string;
  name?: string;
};

//funkcija za kreiranje tokena
export function signAuthToken(claims: JwtUserClaims) {
  return jwt.sign(claims, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
}

//funkcija za proveru tokena (proveravamo da li je korisnik prijavljen iz cookieja)
export function verifyAuthToken(token: string) {
  const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload &
    JwtUserClaims;

  if (!payload || !payload.sub || !payload.email) {
    throw new Error("Invalid token");
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name
  };
}

//opcije za kuki
export function cookieOpts() {
    return {
        httpOnly: true, //javascript ne sme da pristupi
        sameSite: "lax" as const, //zastita od eksternih sajtova
        secure: process.env.NODE_ENV === "production",  
        path: "/",
        maxAge: 60 * 60 * 24 * 7 //trajanje kukija
    }
}