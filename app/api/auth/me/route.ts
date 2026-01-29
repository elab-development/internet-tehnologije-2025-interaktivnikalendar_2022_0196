import { db } from "@/db";
import { user } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  //citamo token
  const token = (await cookies()).get(AUTH_COOKIE)?.value;

  //ako nema token nije log in
  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    //ako je log in
    const claims = verifyAuthToken(token);

    //trazimo korisnika iz baze
    const [u] = await db
      .select({
        idUser: user.idUser,
        ime: user.ime,
        prezime: user.prezime,
        email: user.email,
        userRole: user.userRole,
      })
      .from(user)
      .where(eq(user.idUser, parseInt(claims.sub)));

    return NextResponse.json({ user: u ?? null });
  } catch {
    //istekao token
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
