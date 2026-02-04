import { db } from "@/db";
import { category } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    
    const categoriesAll = await db.select().from(category);

    return NextResponse.json({ category: categoriesAll });
  } catch (error) {
    return NextResponse.json(
      { error: "Greška pri prikazivanju kategorija" },
      { status: 500 },
    );
  }
}
