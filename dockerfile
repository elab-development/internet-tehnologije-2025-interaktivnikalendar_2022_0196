# Faza 1 — zavisnosti (dependencies)
FROM node:20-alpine AS deps

WORKDIR /app

# kopiramo package fajlove
COPY package.json package-lock.json ./

# instaliramo sve zavisnosti
RUN npm ci

# Faza 2 — build
FROM node:20-alpine AS builder

WORKDIR /app

# kopiramo zavisnosti iz prethodne faze
COPY --from=deps /app/node_modules ./node_modules

# kopiramo ceo projekat
COPY . .

# dummy env varijable samo za build fazu — prava baza nije potrebna ovde
ENV DATABASE_URL="mysql://user:pass@localhost:3306/db"
ENV JWT_SECRET="build-secret"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"

# buildujemo Next.js aplikaciju
RUN npm run build

# Faza 3 — produkcija
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# kreiramo non-root korisnika zbog bezbednosti
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# kopiramo samo ono sto je potrebno za pokretanje
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# postavljamo vlasnika fajlova
RUN chown -R nextjs:nodejs /app

# koristimo non-root korisnika
USER nextjs

# port na kome ce aplikacija raditi
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# pokretanje aplikacije
CMD ["node", "server.js"]