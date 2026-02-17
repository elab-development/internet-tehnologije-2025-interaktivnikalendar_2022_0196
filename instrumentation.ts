// ovaj fajl next.js automatski poziva jednom kada se server pokrene

export async function register() {
  // pokrecemo worker samo na serveru, ne u browseru
  // next.js moze da pokrene ovaj fajl i na klijentskoj strani, pa proveravamo
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startNotificationWorker } = await import(
      "@/lib/notificationWorker"
    );
    startNotificationWorker();
  }
}