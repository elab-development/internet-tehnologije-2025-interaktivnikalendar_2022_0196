# 📅 Interaktivni Kalendar

Web aplikacija za organizaciju događaja, napravljena u Next.js-u sa MySQL bazom.

## Tehnologije

- **Next.js 15** + TypeScript
- **Tailwind CSS**
- **MySQL** + Drizzle ORM
- **JWT** autentifikacija (HTTP-only cookies)
- **Mailtrap** za email notifikacije
- **Docker** + **Docker Compose**

## Pokretanje lokalno

```bash
# 1. Kloniraj repo
git clone <URL>
cd interaktivni-kalendar

# 2. Instaliraj zavisnosti
npm install

# 3. Napravi .env fajl
cp .env.example .env
# popuni vrednosti (DATABASE_URL, JWT_SECRET, Mailtrap kredencijali...)

# 4. Pokreni
npm run dev
```

Aplikacija je dostupna na `http://localhost:3000`

## Pokretanje putem Dockera

```bash
# Pokreni sve servise (app + mysql)
docker-compose up -d

# Zaustavi
docker-compose down
```

## Produkcija

Aplikacija je deploovana na Render:  
🔗 https://internet-tehnologije-2025-q93e.onrender.com


## Autori

- Teodora Mikić (2022/0196)
- Bojana Raonić (2022/0170)

Mentor: Aleksandar Joksimović  
Fakultet organizacionih nauka, 2025.
