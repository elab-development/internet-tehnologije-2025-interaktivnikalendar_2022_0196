import { db } from "@/db";
import { user } from "@/db/schema";
import { verifyAuthToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    const userId = parseInt(payload.sub);

    const [currentUser] = await db
      .select({
        idUser: user.idUser,
        userRole: user.userRole,
      })
      .from(user)
      .where(eq(user.idUser, userId));

    if (!currentUser) {
      return NextResponse.json(
        { error: "Korisnik ne postoji" },
        { status: 404 },
      );
    }
    if (currentUser.userRole !== "ADMIN") {
      return NextResponse.json(
        {
          error:
            "Nemate dozvolu za ovu akciju. Samo administratori mogu pristupiti.",
        },
        { status: 403 },
      );
    }

    const allUsers = await db
      .select({
        idUser: user.idUser,
        ime: user.ime,
        prezime: user.prezime,
        email: user.email,
        userRole: user.userRole,
      })
      .from(user);

    return NextResponse.json({ users: allUsers });

  } catch (error) {}
}