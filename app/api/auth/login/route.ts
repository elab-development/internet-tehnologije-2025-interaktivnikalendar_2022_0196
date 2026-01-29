import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";

type Body = {
  email: string;
  password: string;
};

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as Body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Pogresan email ili lozinka" },
      { status: 401 },
    );
  }

  //provera mejla
  const [userExist] = await db.select().from(user).where(eq(user.email, email));

  if (!userExist) {
    return NextResponse.json(
      { error: "Pogresan email ili lozinka" },
      { status: 401 },
    );
  }

  //provera lozinke
  const decryptPass = await bcrypt.compare(password, userExist.passHash);
  if (!decryptPass) {
    return NextResponse.json(
      { error: "Pogresan email ili lozinka" },
      { status: 401 },
    );
  }

  //kreiranje tokena
  const token = signAuthToken({
    sub: userExist.idUser.toString(),
    email: userExist.email,
  });

  //kreiranje kukija
  const res = NextResponse.json(userExist);
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

  return res;
}
