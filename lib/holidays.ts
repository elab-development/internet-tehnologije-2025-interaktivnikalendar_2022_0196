// Tip za praznik iz Nager.Date API
export interface Holiday {
  date: string;           // "2026-01-07"
  localName: string;      // "Božić"
  name: string;           // "Orthodox Christmas Day"
  countryCode: string;    // "RS"
  fixed: boolean;
  global: boolean;
  types: string[];
}

// Funkcija za dohvatanje praznika za određenu godinu
export async function fetchHolidays(year: number): Promise<Holiday[]> {
  try {
    const response = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/RS`
    );

    if (!response.ok) {
      throw new Error("Greška pri dohvatanju praznika");
    }

    const holidays: Holiday[] = await response.json();
    return holidays;
  } catch (error) {
    console.error("Greška pri dohvatanju praznika:", error);
    return []; // vraćamo prazan niz ako API ne radi
  }
}

// Helper funkcija za proveru da li je određeni datum praznik
export function getHolidayForDate(
  holidays: Holiday[],
  year: number,
  month: number, // 0-11 (JS format)
  day: number
): Holiday | null {
  // formatiramo datum u YYYY-MM-DD format
  const monthStr = String(month + 1).padStart(2, "0"); // 0 → "01"
  const dayStr = String(day).padStart(2, "0");          // 7 → "07"
  const dateStr = `${year}-${monthStr}-${dayStr}`;     // "2026-01-07"

  // trazimo praznik sa tim datumom
  const holiday = holidays.find((h) => h.date === dateStr);
  return holiday || null;
}