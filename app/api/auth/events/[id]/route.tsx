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

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    const userId = parseInt(payload.sub);

    const params = await context.params;
    const eventId = parseInt(params.id);

    //validacija idEventa
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: "Nevalidan ID događaja" },
        { status: 400 },
      );
    }

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

    //provera da li dogadjaj postoji u bazi
    const [existingEvent] = await db
      .select()
      .from(event)
      .where(eq(event.idEvent, eventId))
      .limit(1);
    if (!existingEvent) {
      return NextResponse.json(
        { error: "Događaj ne postoji" },
        { status: 404 },
      );
    }

    //da ne moze neko drugi da menja tudji dogadjaj
    if (existingEvent.idUser !== userId) {
      return NextResponse.json(
        { error: "Nemate dozvolu da izmenite ovaj događaj" },
        { status: 403 },
      );
    }

    await db
      .update(event)
      .set({
        naziv: naziv,
        pocetakDogadjaja: new Date(pocetakDogadjaja),
        krajDogadjaja: new Date(krajDogadjaja),
        opis: opis || null,
        vazan: vazan || false,
        privatnost: privatnost || "privatan",
        idUser: userId,
        idCategory: idCategory || null,
      })
      .where(eq(event.idEvent, eventId));

    const updatedEvent = await db
      .select()
      .from(event)
      .where(eq(event.idEvent, eventId));

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error("Greška pri azuriranju događaja:", error);

    return NextResponse.json(
      { error: "Greška pri azuriranju događaja" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    const userId = parseInt(payload.sub);

    const params = await context.params;
    const eventId = parseInt(params.id);

    //validacija idEventa
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: "Nevalidan ID događaja" },
        { status: 400 },
      );
    }

    //provera da li dogadjaj postoji u bazi
    const [existingEvent] = await db
      .select()
      .from(event)
      .where(eq(event.idEvent, eventId))
      .limit(1);
    if (!existingEvent) {
      return NextResponse.json(
        { error: "Događaj ne postoji" },
        { status: 404 },
      );
    }

    //da ne moze neko drugi da menja tudji dogadjaj
    if (existingEvent.idUser !== userId) {
      return NextResponse.json(
        { error: "Nemate dozvolu da izmenite ovaj događaj" },
        { status: 403 },
      );
    }

    await db.delete(event).where(eq(event.idEvent, eventId));

    return NextResponse.json(
      {
        message: "Događaj uspešno obrisan",
        idEvent: eventId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Greška pri brisanju događaja:", error);

    return NextResponse.json(
      { error: "Greška pri brisanju događaja" },
      { status: 500 },
    );
  }
}
