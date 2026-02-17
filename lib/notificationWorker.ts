import cron from "node-cron";
import { db } from "@/db";
import { notification, event, user } from "@/db/schema";
import { eq, and, lte } from "drizzle-orm";
import { sendNotificationEmail } from "@/lib/mailer";

let isRunning = false;

async function processNotifications() {
  try {
    const now = new Date();

    const pendingNotifications = await db
      .select({
        idNotification: notification.idNotification,
        zakazanoVreme: notification.zakazanoVreme,
        vremenskiOffset: notification.vremenskiOffset,
        eventNaziv: event.naziv,
        eventPocetak: event.pocetakDogadjaja,
        eventKraj: event.krajDogadjaja,
        eventOpis: event.opis,
        userEmail: user.email,
        userIme: user.ime,
      })
      .from(notification)
      .innerJoin(event, eq(notification.idEvent, event.idEvent))
      .innerJoin(user, eq(notification.idUser, user.idUser))
      .where(
        and(
          eq(notification.status, "pending"),
          lte(notification.zakazanoVreme, now)
        )
      );

    if (pendingNotifications.length === 0) return;

    console.log(`[Notifikacije] Pronadjeno ${pendingNotifications.length} notifikacija za slanje...`);

    for (const notif of pendingNotifications) {
      try {
        await sendNotificationEmail({
          toEmail: notif.userEmail,
          toName: notif.userIme,
          eventName: notif.eventNaziv,
          eventStart: notif.eventPocetak,
          eventEnd: notif.eventKraj,
          eventDesc: notif.eventOpis ?? undefined,
          minutesBefore: notif.vremenskiOffset,
        });

        await db
          .update(notification)
          .set({ status: "sent" })
          .where(eq(notification.idNotification, notif.idNotification));

        console.log(`[Notifikacije] ✅ Poslato: ${notif.eventNaziv} → ${notif.userEmail}`);

      } catch (emailError) {
        //neuspesno slanje
        await db
          .update(notification)
          .set({ status: "failed" })
          .where(eq(notification.idNotification, notif.idNotification));

        console.error(`[Notifikacije] ❌ Neuspesno slanje notifikacije za: ${notif.eventNaziv}`, emailError);
      }
    }

  } catch (error) {
    console.error("[Notifikacije] Greška u processNotifications:", error);
  }
}

export function startNotificationWorker() {
  if (isRunning) {
    console.log("[Notifikacije] Worker je vec pokrenut.");
    return;
  }

  isRunning = true;
  console.log("[Notifikacije] Worker pokrenut — proverava svakog minuta.");

  cron.schedule("* * * * *", () => {
    processNotifications();
  });
}