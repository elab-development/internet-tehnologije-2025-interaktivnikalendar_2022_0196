import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Interaktivni Kalendar API",
      version: "1.0.0",
      description:
        "API dokumentacija za Interaktivni Kalendar projekat. Autentifikacija se vrši putem HTTP-only kolačića koji se postavljaju pri prijavi.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Lokalni server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            idUser: { type: "integer", example: 1 },
            ime: { type: "string", example: "Marko" },
            prezime: { type: "string", example: "Marković" },
            email: { type: "string", example: "marko@example.com" },
            userRole: {
              type: "string",
              enum: ["ADMIN", "REGISTROVANI_USER", "GOST"],
              example: "REGISTROVANI_USER",
            },
          },
        },
        Event: {
          type: "object",
          properties: {
            idEvent: { type: "integer", example: 1 },
            naziv: { type: "string", example: "Sastanak sa klijentom" },
            pocetakDogadjaja: {
              type: "string",
              format: "date-time",
              example: "2026-03-10T10:00:00.000Z",
            },
            krajDogadjaja: {
              type: "string",
              format: "date-time",
              example: "2026-03-10T11:30:00.000Z",
            },
            opis: { type: "string", example: "Prezentacija novog projekta" },
            vazan: { type: "boolean", example: true },
            privatnost: {
              type: "string",
              enum: ["privatan", "javan"],
              example: "privatan",
            },
            idUser: { type: "integer", example: 1 },
            idCategory: { type: "integer", nullable: true, example: 2 },
          },
        },
        Category: {
          type: "object",
          properties: {
            idCategory: { type: "integer", example: 1 },
            naziv: { type: "string", example: "Posao" },
            boja: { type: "string", example: "#ffb3ba" },
          },
        },
        Notification: {
          type: "object",
          properties: {
            idNotification: { type: "integer", example: 1 },
            zakazanoVreme: {
              type: "string",
              format: "date-time",
              example: "2026-03-10T09:30:00.000Z",
            },
            status: {
              type: "string",
              enum: ["pending", "sent", "failed"],
              example: "pending",
            },
            vremenskiOffset: { type: "integer", example: 30 },
            idEvent: { type: "integer", example: 1 },
            idUser: { type: "integer", example: 1 },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Niste prijavljeni" },
          },
        },
      },
    },
    paths: {
      // ==================== AUTH ====================
      "/api/auth/register": {
        post: {
          tags: ["Autentifikacija"],
          summary: "Registracija novog korisnika",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["ime", "prezime", "email", "password"],
                  properties: {
                    ime: { type: "string", example: "Marko" },
                    prezime: { type: "string", example: "Marković" },
                    email: { type: "string", example: "marko@example.com" },
                    password: { type: "string", example: "lozinka123" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Korisnik uspešno registrovan",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
            "400": {
              description: "Nedostaju podaci ili email već postoji",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Autentifikacija"],
          summary: "Prijava korisnika",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "marko@example.com" },
                    password: { type: "string", example: "lozinka123" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Uspešna prijava, postavlja auth kolačić",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
            "401": {
              description: "Pogrešan email ili lozinka",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Autentifikacija"],
          summary: "Odjava korisnika",
          responses: {
            "200": { description: "Uspešna odjava, briše auth kolačić" },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Autentifikacija"],
          summary: "Vraća trenutno prijavljenog korisnika",
          responses: {
            "200": {
              description: "Podaci o prijavljenom korisniku",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
            "401": {
              description: "Nije prijavljen",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },

      // ==================== EVENTS ====================
      "/api/events": {
        get: {
          tags: ["Događaji"],
          summary: "Dohvata sve događaje prijavljenog korisnika",
          responses: {
            "200": {
              description: "Lista događaja",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Event" },
                  },
                },
              },
            },
            "401": {
              description: "Nije prijavljen",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Događaji"],
          summary: "Kreira novi događaj",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["naziv", "pocetakDogadjaja", "krajDogadjaja"],
                  properties: {
                    naziv: { type: "string", example: "Sastanak" },
                    pocetakDogadjaja: {
                      type: "string",
                      format: "date-time",
                      example: "2026-03-10T10:00",
                    },
                    krajDogadjaja: {
                      type: "string",
                      format: "date-time",
                      example: "2026-03-10T11:00",
                    },
                    opis: { type: "string", example: "Opis događaja" },
                    vazan: { type: "boolean", example: false },
                    privatnost: {
                      type: "string",
                      enum: ["privatan", "javan"],
                      example: "privatan",
                    },
                    idCategory: {
                      type: "integer",
                      nullable: true,
                      example: 1,
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Događaj uspešno kreiran",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Event" },
                },
              },
            },
            "400": {
              description: "Nedostaju obavezna polja ili kraj pre početka",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "401": {
              description: "Nije prijavljen",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/events/{id}": {
        put: {
          tags: ["Događaji"],
          summary: "Ažurira postojeći događaj",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID događaja",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    naziv: { type: "string" },
                    pocetakDogadjaja: { type: "string", format: "date-time" },
                    krajDogadjaja: { type: "string", format: "date-time" },
                    opis: { type: "string" },
                    vazan: { type: "boolean" },
                    privatnost: { type: "string" },
                    idCategory: { type: "integer", nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Događaj uspešno ažuriran",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Event" },
                },
              },
            },
            "403": {
              description: "Nemate dozvolu",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "404": {
              description: "Događaj ne postoji",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Događaji"],
          summary: "Briše događaj",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID događaja",
            },
          ],
          responses: {
            "200": { description: "Događaj uspešno obrisan" },
            "403": {
              description: "Nemate dozvolu",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "404": {
              description: "Događaj ne postoji",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/api/events/export": {
        get: {
          tags: ["Događaji"],
          summary: "Eksportuje događaje kao .ics fajl (iCalendar format)",
          responses: {
            "200": {
              description: "ICS fajl za preuzimanje",
              content: { "text/calendar": {} },
            },
            "401": {
              description: "Nije prijavljen",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },

      // ==================== CATEGORIES ====================
      "/api/categories": {
        get: {
          tags: ["Kategorije"],
          summary: "Dohvata sve kategorije",
          responses: {
            "200": {
              description: "Lista kategorija",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      category: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Category" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ==================== NOTIFICATIONS ====================
      "/api/notifications": {
        get: {
          tags: ["Notifikacije"],
          summary: "Dohvata sve notifikacije prijavljenog korisnika",
          responses: {
            "200": {
              description: "Lista notifikacija",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      notifications: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Notification" },
                      },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Nije prijavljen",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Notifikacije"],
          summary: "Kreira email podsetnik za događaj",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["idEvent", "vremenskiOffset"],
                  properties: {
                    idEvent: { type: "integer", example: 1 },
                    vremenskiOffset: {
                      type: "integer",
                      example: 30,
                      description: "Broj minuta pre događaja",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Notifikacija uspešno kreirana",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Notification" },
                },
              },
            },
            "400": {
              description: "Nevalidni podaci ili vreme podsetnika je prošlo",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "403": {
              description: "Nemate dozvolu za ovaj događaj",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },

      // ==================== ADMIN ====================
      "/api/admin/users": {
        get: {
          tags: ["Admin"],
          summary: "Dohvata sve korisnike (samo ADMIN uloga)",
          responses: {
            "200": {
              description: "Lista svih korisnika",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      users: {
                        type: "array",
                        items: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
            },
            "403": {
              description: "Nije admin",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            "401": {
              description: "Nije prijavljen",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);