import { AUTH_COOKIE } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  //kreiramo http odgovor gde kazemo da je logout uspesan
  const res = NextResponse.json({ ok: true });

  // brisemo cookie i to radimo sa maxAge 0
  res.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return res;
}
