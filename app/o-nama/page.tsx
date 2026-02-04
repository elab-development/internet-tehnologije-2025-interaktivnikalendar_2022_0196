import React from 'react'
import Button from '../components/Button'

const OnamaPage = () => {
  return (
    <div className="flex flex-col gap-14">
      {/* 1. O NAMA – BELA SEKCIJA */}
      <div className="w-[80%] bg-white m-auto rounded-3xl mt-15 py-12">
        <h1 className="font-bold text-[40px] mb-7 text-center">O nama</h1>

        <p className="w-[80%] mx-auto text-justify text-[18px]">
          Mi verujemo da dobar kalendar nije samo spisak datuma – već alat koji
          pomaže da se vreme bolje iskoristi, obaveze lakše prate i planovi
          pretvore u stvarnost. <br />
          <br />
          Zato smo kreirali <b>interaktivni kalendar</b> koji je jednostavan za
          korišćenje, pregledan i prilagodljiv svakodnevnim potrebama. <br />
          <br />
          Naš kalendar omogućava lako planiranje događaja, praćenje obaveza i
          bolju organizaciju vremena – bilo da ga koristite za lične planove,
          fakultet, posao ili timski rad. Interaktivni elementi omogućavaju brz
          unos, izmenu i pregled informacija, bez nepotrebne komplikacije.{" "}
          <br />
          <br />
          Cilj nam je da korisnicima pružimo{" "}
          <b>praktično i intuitivno rešenje</b> koje štedi vreme i donosi osećaj
          kontrole nad svakodnevnim obavezama.
        </p>
      </div>

      {/* 2. KAKO FUNKCIONIŠE – ROZE SEKCIJA */}
      <div className="w-[80%] bg-pink-50 m-auto rounded-3xl py-12">
        <h2 className="text-[32px] font-semibold mb-10 text-center text-pink-600">
          Kako funkcioniše?
        </h2>

        <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <h3 className="font-semibold mb-3 text-pink-600">
              1. Registracija
            </h3>
            <p>Kreirajte nalog ili se prijavite na postojeći.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <h3 className="font-semibold mb-3 text-pink-600">2. Planiranje</h3>
            <p>Dodajte događaje i obaveze u kalendar.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <h3 className="font-semibold mb-3 text-pink-600">3. Praćenje</h3>
            <p>Pratite i menjajte planove u realnom vremenu.</p>
          </div>
        </div>
      </div>

      {/* 3. KOME JE NAMENJEN + CTA – BELA SEKCIJA */}
      <div className="w-[80%] bg-white m-auto rounded-3xl py-14 mb-20">
        <h2 className="text-[32px] font-semibold mb-10 text-center">
          Kome je namenjen?
        </h2>

        <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div className="bg-pink-50 rounded-2xl p-6 text-center">
            <h3 className="font-semibold text-pink-600 mb-2">Studenti</h3>
            <p>Organizacija rokova, ispita i svakodnevnih obaveza.</p>
          </div>

          <div className="bg-pink-50 rounded-2xl p-6 text-center">
            <h3 className="font-semibold text-pink-600 mb-2">Zaposleni</h3>
            <p>Planiranje radnog vremena i poslovnih obaveza.</p>
          </div>

          <div className="bg-pink-50 rounded-2xl p-6 text-center">
            <h3 className="font-semibold text-pink-600 mb-2">Timovi</h3>
            <p>Zajedničko praćenje događaja i aktivnosti.</p>
          </div>

          <div className="bg-pink-50 rounded-2xl p-6 text-center">
            <h3 className="font-semibold text-pink-600 mb-2">Svi korisnici</h3>
            <p>Jednostavna i efikasna organizacija vremena.</p>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-[26px] font-semibold mb-4">
            Započni sa organizacijom već danas
          </h3>
          <p className="mb-6">
            Registruj se i iskoristi sve prednosti interaktivnog kalendara.
          </p>
          <Button
            label="Registruj se"
            href="/register"
            variant="register"
            type="button"
            
          />
        </div>
      </div>
    </div>
  );
}

export default OnamaPage
