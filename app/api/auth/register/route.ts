import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";

type Body = {
  ime: string;
  prezime: string;
  email: string;
  password: string;
};

export async function POST(req: Request) {
  //citanje podataka iz post requesta
  const { ime, prezime, email, password } = (await req.json()) as Body;

  if (!ime || !prezime || !email || !password) {
    return NextResponse.json({ error: "Nedostaju podaci" }, { status: 400 });
  }

  const exists = await db.select().from(user).where(eq(user.email, email));
  if (exists.length) {
    return NextResponse.json(
      { error: "Email već postoji u bazi" },
      { status: 400 },
    );
  }

  const passHash = await bcrypt.hash(password, 10);

  const result = await db
    .insert(user)
    .values({ ime, prezime, email, passHash });

  const insertId = result[0].insertId;

  const [newUser] = await db
    .select({
      idUser: user.idUser,
      ime: user.ime,
      prezime: user.prezime,
      email: user.email,
      userRole: user.userRole,
    })
    .from(user)
    .where(eq(user.idUser, insertId));

  //kreiranje tokena
  const token = signAuthToken({
    sub: newUser.idUser.toString(),
    email: newUser.email,
  });

  //postavljanje kukija
  const res = NextResponse.json(newUser);
  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

  return res;
}
