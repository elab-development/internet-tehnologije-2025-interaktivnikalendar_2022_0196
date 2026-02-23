import { db } from "@/db";
import { event, category } from "@/db/schema";
import { verifyAuthToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createEvents, EventAttributes } from "ics";

export async function GET() {
  try {
    // provera da li je korisnik ulogovan
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    const userId = parseInt(payload.sub);

    // dohvatamo sve dogadjaje korisnika sa kategorijom
    const events = await db
      .select({
        idEvent: event.idEvent,
        naziv: event.naziv,
        pocetakDogadjaja: event.pocetakDogadjaja,
        krajDogadjaja: event.krajDogadjaja,
        opis: event.opis,
        vazan: event.vazan,
        kategorijaIme: category.naziv,
      })
      .from(event)
      .leftJoin(category, eq(event.idCategory, category.idCategory))
      .where(eq(event.idUser, userId))
      .orderBy(event.pocetakDogadjaja);

    if (events.length === 0) {
      return NextResponse.json(
        { error: "Nemate događaje za izvoz" },
        { status: 404 },
      );
    }

    // konvertujemo dogadjaje u format koji ics paket ocekuje
    const icsEvents: EventAttributes[] = events.map((evt) => {
      const start = new Date(evt.pocetakDogadjaja);
      const end = new Date(evt.krajDogadjaja);

      return {
        title: evt.naziv,
        start: [
          start.getFullYear(),
          start.getMonth() + 1, // ics koristi 1-12, JS koristi 0-11
          start.getDate(),
          start.getHours(),
          start.getMinutes(),
        ],
        end: [
          end.getFullYear(),
          end.getMonth() + 1,
          end.getDate(),
          end.getHours(),
          end.getMinutes(),
        ],
        description: evt.opis || undefined,
        categories: evt.kategorijaIme ? [evt.kategorijaIme] : undefined,
      };
    });

    // generisanje .ics fajla
    const { error, value } = createEvents(icsEvents);

    // alternativni scenario 2.1 - greska pri generisanju
    if (error) {
      console.error("Greška pri generisanju .ics fajla:", error);
      return NextResponse.json(
        { error: "Neuspešno generisanje .ics fajla." },
        { status: 500 },
      );
    }

    // vracamo fajl kao download
    return new NextResponse(value, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="kalendar.ics"',
      },
    });
  } catch (error) {
    console.error("Greška pri izvozu događaja:", error);
    return NextResponse.json(
      { error: "Greška pri izvozu događaja" },
      { status: 500 },
    );
  }
}
