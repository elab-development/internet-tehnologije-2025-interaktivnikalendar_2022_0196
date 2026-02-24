import { POST } from "@/app/api/auth/register/route";


jest.mock("@/db", () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue(undefined),
    set: jest.fn(),
  }),
}));

jest.mock("@/lib/auth", () => ({
  AUTH_COOKIE: "auth",
  signAuthToken: jest.fn().mockReturnValue("fake-jwt-token"),
  cookieOpts: jest.fn().mockReturnValue({}),
}));

import { db } from "@/db";

function makeRequest(body: object) {
  return new Request("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// TESTOVI

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("vraca 400 ako nedostaju podaci", async () => {
    const req = makeRequest({
      ime: "",
      prezime: "",
      email: "",
      password: "",
    });

    const res = await POST(req);

    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("Nedostaju podaci");
  });

  test("vraca 400 ako email vec postoji u bazi", async () => {
    // simuliramo da korisnik vec postoji
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([
          { idUser: 1, email: "marko@test.com" },
        ]),
      }),
    });

    const req = makeRequest({
      ime: "Marko",
      prezime: "Markovic",
      email: "marko@test.com",
      password: "lozinka123",
    });

    const res = await POST(req);

    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe("Email već postoji u bazi");
  });

  test("vraca 200 i novog korisnika ako su podaci ispravni", async () => {
    // prvi select – provera da li postoji
    (db.select as jest.Mock)
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      })
      // drugi select – vracanje novog korisnika
      .mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([
            {
              idUser: 1,
              ime: "Marko",
              prezime: "Markovic",
              email: "marko@test.com",
              userRole: "REGISTROVANI_USER",
            },
          ]),
        }),
      });

    // simuliramo insert
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockResolvedValue([{ insertId: 1 }]),
    });

    const req = makeRequest({
      ime: "Marko",
      prezime: "Markovic",
      email: "marko@test.com",
      password: "lozinka123",
    });

    const res = await POST(req);

    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.email).toBe("marko@test.com");
    expect(body.passHash).toBeUndefined();
  });
});