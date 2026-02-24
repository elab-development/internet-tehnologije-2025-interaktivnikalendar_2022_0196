import { POST } from "@/app/api/auth/login/route";


// mock za bazu — db.select().from().where() vraca laznog korisnika
jest.mock("@/db", () => ({
  db: {
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]), // default — prazan niz, iterabilan
      }),
    }),
  },
}));

// mock za bcrypt
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

// mock za cookies
jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue(undefined),
    set: jest.fn(),
  }),
}));

// mock za auth helper
jest.mock("@/lib/auth", () => ({
  AUTH_COOKIE: "auth",
  signAuthToken: jest.fn().mockReturnValue("fake-jwt-token"),
  cookieOpts: jest.fn().mockReturnValue({}),
}));

// importujemo mockove da ih kontrolisemo u testovima
import { db } from "@/db";
import bcrypt from "bcrypt";

// helper za pravljenje laznog Request objekta
function makeRequest(body: object) {
  return new Request("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// TESTOVI
describe("POST /api/auth/login", () => {

  // pre svakog testa resetujemo mockove
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("vraca 401 ako email ili lozinka nisu poslati", async () => {
    const req = makeRequest({ email: "", password: "" });
    const res = await POST(req);

    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.error).toBe("Pogresan email ili lozinka");
  });

  test("vraca 401 ako email nije validan format", async () => {
    const req = makeRequest({ email: "nijevalidan", password: "lozinka123" });
    const res = await POST(req);

    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.error).toBe("Pogresan email ili lozinka");
  });

  test("vraca 401 ako korisnik ne postoji u bazi", async () => {
    // simuliramo da baza vraca prazan niz — korisnik ne postoji
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    });

    const req = makeRequest({ email: "test@test.com", password: "lozinka123" });
    const res = await POST(req);

    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.error).toBe("Pogresan email ili lozinka");
  });

  test("vraca 401 ako je lozinka pogresna", async () => {
    // simuliramo da korisnik postoji u bazi
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([
          {
            idUser: 1,
            email: "test@test.com",
            passHash: "hashed_password",
            ime: "Test",
            prezime: "Korisnik",
            userRole: "REGISTROVANI_USER",
          },
        ]),
      }),
    });

    // simuliramo da bcrypt vraca false — lozinka ne odgovara
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req = makeRequest({ email: "test@test.com", password: "pogresna" });
    const res = await POST(req);

    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.error).toBe("Pogresan email ili lozinka");
  });

  test("vraca 200 i korisnika ako su kredencijali ispravni", async () => {
    // simuliramo da korisnik postoji u bazi
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([
          {
            idUser: 1,
            email: "test@test.com",
            passHash: "hashed_password",
            ime: "Test",
            prezime: "Korisnik",
            userRole: "REGISTROVANI_USER",
          },
        ]),
      }),
    });

    // simuliramo da bcrypt vraca true — lozinka odgovara
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const req = makeRequest({ email: "test@test.com", password: "ispravna123" });
    const res = await POST(req);

    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.email).toBe("test@test.com");
    // provera da je korisnik prijavljen uspesno
    expect(body.idUser).toBe(1);
  });
});