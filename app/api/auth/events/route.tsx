import { db } from "@/db";
import { event } from "@/db/schema";
import { verifyAuthToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export interface EventDto {
  idEvent: number;
  naziv: string;
  pocetakDogadjaja: Date;
  krajDogadjaja: Date;
  opis: string | null;
  vazan: boolean;
  privatnost: string;
  idUser: number;
  idCategory: number | null;
}

export async function GET(req: Request) {
  try {
    //provera da li je korisnik logovan

    //vraca sve kolacice
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    //ako ne postoji token korisnik nije prijavljen
    if (!token) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    //ako postoji
    const payload = verifyAuthToken(token);
    const userId = parseInt(payload.sub);

    const events = await db
      .select()
      .from(event)
      .where(eq(event.idUser, userId))
      .orderBy(event.pocetakDogadjaja);

    return NextResponse.json(events);
  } catch (error) {
    console.error("Greška pri učitavanju događaja:", error);
    return NextResponse.json(
      { error: "Greška pri učitavanju događaja" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    const userId = parseInt(payload.sub);

    const body = await req.json();

    const {
      naziv,
      pocetakDogadjaja,
      krajDogadjaja,
      opis,
      vazan,
      privatnost,
      idCategory,
    } = body;

    //provera obaveznih polja
    if (!naziv || !pocetakDogadjaja || !krajDogadjaja) {
      return NextResponse.json(
        { error: "Naziv, početak i kraj događaja su obavezni" },
        { status: 400 },
      );
    }

    //provera da kraj mora biti posle početka
    if (new Date(krajDogadjaja) <= new Date(pocetakDogadjaja)) {
      return NextResponse.json(
        { error: "Kraj događaja mora biti posle početka" },
        { status: 400 },
      );
    }

    //ubacivanje u bazu
    const result = await db
      .insert(event)
      .values({
        naziv: naziv,
        pocetakDogadjaja: new Date(pocetakDogadjaja),
        krajDogadjaja: new Date(krajDogadjaja),
        opis: opis || null,
        vazan: vazan || false,
        privatnost: privatnost || "privatan",
        idUser: userId,
        idCategory: idCategory || null,
      })
      .$returningId();

    const id = result[0].idEvent;

    const [newEvent] = await db
      .select()
      .from(event)
      .where(eq(event.idEvent, id));

    return NextResponse.json(newEvent, { status: 201 });
    
  } catch (error) {
    console.error("Greška pri kreiranju događaja:", error);

    return NextResponse.json(
      { error: "Greška pri kreiranju događaja" },
      { status: 500 },
    );
  }
}
