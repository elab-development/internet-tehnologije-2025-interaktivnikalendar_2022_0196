import { GET, POST } from "@/app/api/events/route";


jest.mock("@/db", () => ({
  db: {
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          orderBy: jest.fn(),
        }),
      }),
    }),
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        $returningId: jest.fn(),
      }),
    }),
  },
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  verifyAuthToken: jest.fn(),
}));

import { db } from "@/db";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";

function makeGetRequest() {
  return new Request("http://localhost:3000/api/events", { method: "GET" });
}

function makePostRequest(body: object) {
  return new Request("http://localhost:3000/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// TESTOVI
describe("GET /api/events", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("vraca 401 ako korisnik nije prijavljen", async () => {
    // simuliramo da nema tokena u kolacicu
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.error).toBe("Niste prijavljeni");
  });

  test("vraca 200 i listu dogadjaja za prijavljenog korisnika", async () => {
    // simuliramo da postoji token
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });

    // simuliramo da je token validan
    (verifyAuthToken as jest.Mock).mockReturnValue({ sub: "1", email: "test@test.com" });

    // simuliramo dogadjaje iz baze
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          orderBy: jest.fn().mockResolvedValue([
            {
              idEvent: 1,
              naziv: "Sastanak",
              pocetakDogadjaja: new Date("2026-03-10T10:00:00"),
              krajDogadjaja: new Date("2026-03-10T11:00:00"),
              opis: null,
              vazan: false,
              privatnost: "privatan",
              idUser: 1,
              idCategory: null,
            },
          ]),
        }),
      }),
    });

    const res = await GET(makeGetRequest());

    expect(res.status).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0].naziv).toBe("Sastanak");
  });
});

describe("POST /api/events", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("vraca 401 ako korisnik nije prijavljen", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const res = await POST(makePostRequest({ naziv: "Test" }));

    expect(res.status).toBe(401);
  });

  test("vraca 400 ako nedostaju obavezna polja", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });

    (verifyAuthToken as jest.Mock).mockReturnValue({ sub: "1", email: "test@test.com" });

    const res = await POST(makePostRequest({ naziv: "", pocetakDogadjaja: "", krajDogadjaja: "" }));

    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("Naziv, početak i kraj događaja su obavezni");
  });

  test("vraca 400 ako je kraj pre pocetka", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });

    (verifyAuthToken as jest.Mock).mockReturnValue({ sub: "1", email: "test@test.com" });

    const res = await POST(makePostRequest({
      naziv: "Sastanak",
      pocetakDogadjaja: "2026-03-10T11:00",
      krajDogadjaja: "2026-03-10T10:00", // kraj pre pocetka
    }));

    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("Kraj događaja mora biti posle početka");
  });

  test("vraca 201 kada je dogadjaj uspesno kreiran", async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: "valid-token" }),
    });

    (verifyAuthToken as jest.Mock).mockReturnValue({ sub: "1", email: "test@test.com" });

    // mock za insert
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        $returningId: jest.fn().mockResolvedValue([{ idEvent: 1 }]),
      }),
    });

    // mock za select nakon inserta
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([
          {
            idEvent: 1,
            naziv: "Sastanak",
            pocetakDogadjaja: new Date("2026-03-10T10:00:00"),
            krajDogadjaja: new Date("2026-03-10T11:00:00"),
            opis: null,
            vazan: false,
            privatnost: "privatan",
            idUser: 1,
            idCategory: null,
          },
        ]),
      }),
    });

    const res = await POST(makePostRequest({
      naziv: "Sastanak",
      pocetakDogadjaja: "2026-03-10T10:00",
      krajDogadjaja: "2026-03-10T11:00",
    }));

    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.naziv).toBe("Sastanak");
  });
});