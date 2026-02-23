import { db } from "@/db";
import { event, category } from "@/db/schema";
import { verifyAuthToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    const userId = parseInt(payload.sub);

    // dohvatamo sve događaje korisnika
    const events = await db
      .select()
      .from(event)
      .where(eq(event.idUser, userId));

    // dohvatamo sve kategorije
    const categories = await db.select().from(category);

    // STATISTIKA 1: Broj događaja po mesecima
    // pravimo niz sa 12 meseci, sve na 0
    const eventsByMonth = Array(12).fill(0);
    events.forEach((e) => {
      const month = new Date(e.pocetakDogadjaja).getMonth(); // 0-11
      eventsByMonth[month]++;
    });

    // STATISTIKA 2: Događaji po kategorijama 
    const eventsByCategory = [];

    for (const cat of categories) {
      const count = events.filter(
        (e) => e.idCategory === cat.idCategory,
      ).length;    //koliko dogadjaja pripada toj kategoriji

      eventsByCategory.push({
        naziv: cat.naziv,
        boja: cat.boja,
        count: count, 
      });
    }

    // dodajemo "Bez kategorije"
    const uncategorized = events.filter((e) => e.idCategory === null).length;
    if (uncategorized > 0) {
      eventsByCategory.push({
        naziv: "Bez kategorije",
        boja: "#e5e7eb",
        count: uncategorized,
      });
    }

    return NextResponse.json({
      eventsByMonth,
      eventsByCategory,
      total: events.length,
    });
  } catch (error) {
    console.error("Greška pri dohvatanju statistike:", error);
    return NextResponse.json(
      { error: "Greška pri dohvatanju statistike" },
      { status: 500 }
    );
  }
}
