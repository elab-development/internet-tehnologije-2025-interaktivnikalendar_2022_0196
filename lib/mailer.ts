import nodemailer from "nodemailer";

export type NotificationEmailData = {
  toEmail: string;
  toName: string;
  eventName: string;
  eventStart: Date;
  eventEnd: Date;
  eventDesc?: string;
  minutesBefore: number;
};

export async function sendNotificationEmail(data: NotificationEmailData) {
  // provera tek kad se funkcija pozove ne pri importu
  if (
    !process.env.MAILTRAP_HOST ||
    !process.env.MAILTRAP_USER ||
    !process.env.MAILTRAP_PASS
  ) {
    throw new Error("Nedostaju Mailtrap kredencijali u .env fajlu");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT) || 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const formattedStart = data.eventStart.toLocaleString("sr-RS", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const formattedEnd = data.eventEnd.toLocaleString("sr-RS", {
    timeStyle: "short",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff;">
      <div style="background-color: #fac7d0; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #333; font-size: 24px;">📅 Podsetnik za događaj</h1>
      </div>
      <p style="color: #555; font-size: 16px;">Zdravo <strong>${data.toName}</strong>,</p>
      <p style="color: #555; font-size: 16px;">Podsetnik: događaj počinje za <strong>${data.minutesBefore} minuta</strong>.</p>
      <div style="background-color: #f9f9f9; border-left: 4px solid #fac7d0; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin: 0 0 10px 0; color: #333;">${data.eventName}</h2>
        <p style="margin: 4px 0; color: #666;">🕐 <strong>Početak:</strong> ${formattedStart}</p>
        <p style="margin: 4px 0; color: #666;">🕐 <strong>Kraj:</strong> ${formattedEnd}</p>
        ${data.eventDesc ? `<p style="margin: 12px 0 0 0; color: #666;">📝 ${data.eventDesc}</p>` : ""}
      </div>
      <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
        Interaktivni kalendar © ${new Date().getFullYear()}
      </p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"Interaktivni kalendar" <${process.env.EMAIL_FROM || "kalendar@app.com"}>`,
    to: data.toEmail,
    subject: `⏰ Podsetnik: ${data.eventName} počinje za ${data.minutesBefore} min`,
    html,
  });

  return info;
}
