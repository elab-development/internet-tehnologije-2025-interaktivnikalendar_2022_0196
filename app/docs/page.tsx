import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import DocsClient from "./DocsClient";

export default async function DocsPage() {
  // provera tokena
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  if (!token) {
    redirect("/login");
  }

  // provera da li je token validan
  let payload;
  try {
    payload = verifyAuthToken(token);
  } catch {
    redirect("/login");
  }

  // provera da li je ADMIN
  const [currentUser] = await db
    .select({ userRole: user.userRole })
    .from(user)
    .where(eq(user.idUser, parseInt(payload.sub)));

  if (!currentUser || currentUser.userRole !== "ADMIN") {
    redirect("/"); 
  }

  return <DocsClient />;
}