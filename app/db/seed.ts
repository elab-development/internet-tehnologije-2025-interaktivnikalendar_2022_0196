import 'dotenv/config'
import { db } from "./index";
import * as schema from "./schema";

async function seed() {
  try {
    console.log("Punjenje tabela...");

    // korisnici
    await db.insert(schema.user).values([
      {
        ime: "Marko",
        prezime: "Marković",
        email: "marko@example.com",
        password: "$2a$10$hashedpassword123",
        userRole: "ADMIN",
      },
      {
        ime: "Ana",
        prezime: "Anić",
        email: "ana@example.com",
        password: "$2a$10$hashedpassword456",
        userRole: "REGISTROVANI_USER",
      },
      {
        ime: "Petar",
        prezime: "Petrović",
        email: "petar@example.com",
        password: "$2a$10$hashedpassword789",
        userRole: "REGISTROVANI_USER",
      },
    ]);
    const users = await db.select().from(schema.user);

    // kategorije
    await db.insert(schema.category).values([
      { naziv: "Posao", boja: "#3b82f6" },
      { naziv: "Lično", boja: "#10b981" },
      { naziv: "Trening", boja: "#f59e0b" },
      { naziv: "Sastanci", boja: "#ef4444" },
      { naziv: "Porodica", boja: "#8b5cf6" },
      { naziv: "Učenje", boja: "#06b6d4" },
    ]);
    const categories = await db.select().from(schema.category);

    //  događaji
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await db.insert(schema.event).values([
      {
        naziv: "Sastanak sa klijentom",
        pocetakDogadjaja: new Date("2026-01-27 10:00:00"),
        krajDogadjaja: new Date("2026-01-27 11:30:00"),
        opis: "Prezentacija novog projekta",
        vazan: true,
        privatnost: "privatan",
        idUser: users[0].idUser,
        idCategory: categories[3].idCategory,
      },
      {
        naziv: "Trening u teretani",
        pocetakDogadjaja: new Date("2026-01-26 18:00:00"),
        krajDogadjaja: new Date("2026-01-26 19:30:00"),
        opis: "Trening nogu",
        vazan: false,
        privatnost: "javan",
        idUser: users[1].idUser,
        idCategory: categories[2].idCategory,
      },
      {
        naziv: "Rođendan",
        pocetakDogadjaja: new Date("2026-02-15 19:00:00"),
        krajDogadjaja: new Date("2026-02-15 23:00:00"),
        opis: "Rođendanska zabava kod kuće",
        vazan: true,
        privatnost: "privatan",
        idUser: users[1].idUser,
        idCategory: categories[4].idCategory,
      },
      {
        naziv: "Kurs programiranja",
        pocetakDogadjaja: new Date("2026-01-28 17:00:00"),
        krajDogadjaja: new Date("2026-01-28 20:00:00"),
        opis: "React napredni koncepti",
        vazan: false,
        privatnost: "javan",
        idUser: users[2].idUser,
        idCategory: categories[5].idCategory,
      },
      {
        naziv: "Projekat deadline",
        pocetakDogadjaja: new Date("2026-01-30 09:00:00"),
        krajDogadjaja: new Date("2026-01-30 17:00:00"),
        opis: "Završetak Q1 projekta",
        vazan: true,
        privatnost: "privatan",
        idUser: users[0].idUser,
        idCategory: categories[0].idCategory,
      },
    ]);
    const events = await db.select().from(schema.event);

    // notifikacije
    await db.insert(schema.notification).values([
      {
        zakazanoVreme: new Date("2026-01-27 09:30:00"),
        status: "pending",
        vremenskiOffset: 30,
        idEvent: events[0].idEvent,
        idUser: users[0].idUser,
      },
      {
        zakazanoVreme: new Date("2026-01-26 17:00:00"),
        status: "sent",
        vremenskiOffset: 60,
        idEvent: events[1].idEvent,
        idUser: users[1].idUser,
      },
      {
        zakazanoVreme: new Date("2026-02-14 19:00:00"),
        status: "pending",
        vremenskiOffset: 1440,
        idEvent: events[2].idEvent,
        idUser: users[1].idUser,
      },
    ]);
    const notifications = await db.select().from(schema.notification);

    //recuring
    await db.insert(schema.recurrence).values([
      {
        tip: "weekly",
        krajPonavljanja: new Date("2026-12-31 23:59:59"),
        daniUNedelji: "MON,WED,FRI",
        idEvent: events[1].idEvent,
      },
      {
        tip: "daily",
        krajPonavljanja: new Date("2026-03-31 23:59:59"),
        daniUNedelji: "MON,TUE,WED,THU,FRI",
        idEvent: events[3].idEvent,
      },
    ]);
    const recurrences = await db.select().from(schema.recurrence);

    console.log("\nGenerisana tabela");
  } catch (error) {
    console.error("Greška tokom seed procesa:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seed();
