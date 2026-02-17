import { db } from "@/db";
import { notification, event } from "@/db/schema";
import { verifyAuthToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // provera da li je korisnik ulogovan
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    const userId = parseInt(payload.sub);

    const body = await req.json();
    const { idEvent, vremenskiOffset } = body;

    // validacija podataka
    if (!idEvent || !vremenskiOffset) {
      return NextResponse.json(
        { error: "idEvent i vremenskiOffset su obavezni" },
        { status: 400 },
      );
    }

    if (vremenskiOffset <= 0) {
      return NextResponse.json(
        { error: "vremenskiOffset mora biti pozitivan broj" },
        { status: 400 },
      );
    }

    // proveravamo da li dogadjaj postoji i pripada korisniku
    const [existingEvent] = await db
      .select()
      .from(event)
      .where(eq(event.idEvent, idEvent))
      .limit(1);

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Događaj ne postoji" },
        { status: 404 },
      );
    }

    if (existingEvent.idUser !== userId) {
      return NextResponse.json(
        { error: "Nemate dozvolu za ovaj događaj" },
        { status: 403 },
      );
    }

    //racunamo kada treba poslati notifikaciju
    //zakazanoVreme = pocetak dogadjaja - offset u minutima
    const zakazanoVreme = new Date(
      new Date(existingEvent.pocetakDogadjaja).getTime() -
        vremenskiOffset * 60 * 1000,
    );

    // proveravamo da zakazano vreme nije u proslosti
    if (zakazanoVreme <= new Date()) {
      return NextResponse.json(
        { error: "Vreme podsetnika je već prošlo. Izaberite veći offset." },
        { status: 400 },
      );
    }

    // upisujemo notifikaciju u bazu sa statusom "pending"
    const result = await db
      .insert(notification)
      .values({
        zakazanoVreme,
        status: "pending",
        vremenskiOffset,
        idEvent,
        idUser: userId,
      })
      .$returningId();

    const idNotification = result[0].idNotification;

    // vracamo kreiranu notifikaciju
    const [newNotification] = await db
      .select()
      .from(notification)
      .where(eq(notification.idNotification, idNotification));

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error("Greška pri kreiranju notifikacije:", error);
    return NextResponse.json(
      { error: "Greška pri kreiranju notifikacije" },
      { status: 500 },
    );
  }
}

// GET - za pregled notifikacija ulogovanog korisnika
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    const userId = parseInt(payload.sub);

    // dohvatamo sve notifikacije korisnika sa detaljima dogadjaja
    const notifications = await db
      .select({
        idNotification: notification.idNotification,
        zakazanoVreme: notification.zakazanoVreme,
        status: notification.status,
        vremenskiOffset: notification.vremenskiOffset,
        eventNaziv: event.naziv,
        eventPocetak: event.pocetakDogadjaja,
      })
      .from(notification)
      .innerJoin(event, eq(notification.idEvent, event.idEvent))
      .where(eq(notification.idUser, userId))
      .orderBy(notification.zakazanoVreme);

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Greška pri dohvatanju notifikacija:", error);
    return NextResponse.json(
      { error: "Greška pri dohvatanju notifikacija" },
      { status: 500 },
    );
  }
}
