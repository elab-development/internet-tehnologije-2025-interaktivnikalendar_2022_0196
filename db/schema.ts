// fajl u kome se definise struktura tabela

import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
  datetime,
  boolean,
  timestamp,
  unique,
} from "drizzle-orm/mysql-core";

//enum za user-a
export const UserRole = mysqlEnum("userRole", [
  "ADMIN",
  "REGISTROVANI_USER",
  "GOST",
]);

//tabela user
export const user = mysqlTable("user", {
  idUser: int("idUser").primaryKey().autoincrement(),
  ime: varchar("ime", { length: 20 }).notNull(),
  prezime: varchar("prezime", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passHash: varchar("password", { length: 255 }).notNull(),
  userRole: UserRole.notNull().default("REGISTROVANI_USER"),
});

//tabela category
export const category = mysqlTable(
  "category",
  {
    idCategory: int("idCategory").primaryKey().autoincrement(),
    naziv: varchar("naziv", { length: 255 }).notNull(),
    boja: varchar("boja", { length: 20 }).notNull().default("#787a7c"),
  },
  (table) => ({
    // UNIQUE constraint - naziv kategorije mora biti jedinstven
    uniqueNaziv: unique("unique_category_naziv").on(table.naziv),
  }),
);

//tabela event
export const event = mysqlTable("event", {
  idEvent: int("idEvent").primaryKey().autoincrement(),
  naziv: varchar("naziv", { length: 100 }).notNull(),
  pocetakDogadjaja: timestamp("pocetakDogadjaja").notNull(),
  krajDogadjaja: timestamp("krajDogadjaja").notNull(),
  opis: varchar("opis", { length: 255 }),
  vazan: boolean("vazan").notNull().default(false),
  privatnost: varchar("privatnost", { length: 20 })
    .notNull()
    .default("privatan"),
  idUser: int("idUser")
    .notNull()
    .references(() => user.idUser, { onDelete: "cascade" }), //obrisace sve eventove ako se obrise korisnik
  idCategory: int("idCategory").references(() => category.idCategory, {
    onDelete: "set null",
  }), //nece obrisati event samo ce staviti kategoriju na null
});

//tabela notification
export const notification = mysqlTable("notification", {
  idNotification: int("idNotification").primaryKey().autoincrement(),
  zakazanoVreme: timestamp("zakazanoVreme").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  vremenskiOffset: int("vremenskiOffset").notNull(),
  idEvent: int("idEvent")
    .notNull()
    .references(() => event.idEvent, { onDelete: "cascade" }),
  idUser: int("idUser")
    .notNull()
    .references(() => user.idUser, { onDelete: "cascade" }),
});

//tabela recurrence
export const recurrence = mysqlTable("recurrence", {
  idRecurrence: int("idRecurrence").primaryKey().autoincrement(),
  tipPonavljanja: varchar("tipPonavljanja", { length: 50 }),
  krajPonavljanja: timestamp("krajPonavljanja").notNull(),
  daniUNedelji: varchar("daniUNedelji", { length: 100 }).notNull(),
  idEvent: int("idEvent")
    .notNull()
    .references(() => event.idEvent, { onDelete: "cascade" }),
});
