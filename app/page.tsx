import Image from "next/image";
import Button from "./components/Button";
import { FcPlanner } from "react-icons/fc";
import { FcAlarmClock } from "react-icons/fc";
import { HiOutlineLightningBolt } from "react-icons/hi";

export default function Home() {
  return (
    <main className="">
      <div className="flex flex-row justify-evenly mt-15 mb-20">
        <section className="flex flex-col basis-140 items-center text-center">
          <h1 className="font-bold text-[40px] mb-5 text-gray-800">
            Interaktivni kalendar za lakšu organizaciju vremena
          </h1>
          <p className="mb-10 text-[18px]  text-gray-700">
            Interaktivni kalendar omogućava jasan i pregledan način planiranja
            obaveza, događaja i važnih datuma. Namenjen je efikasnijoj
            organizaciji vremena u svakodnevnim aktivnostima.
          </p>
          <Button
            label="Otvori kalendar"
            href="/login"
            variant="login"
            type="button"
            className="w-[40%] text-center py-3 text-[18px]"
          />
        </section>
        <section className="flex basis-140">
          <Image
            src="/images/kalendar.jpg"
            alt="Interaktivni kalendar"
            width={800}
            height={800}
            className="rounded-lg"
          />
        </section>
      </div>
      <div className="bg-gray-50 flex flex-row justify-evenly items-center h-120 items-stretch pb-20">
        <div className="flex flex-col items-center justify-center w-[23%] border border-gray-700 bg-[#fac7d0] rounded-xl border-0 mt-15 shadow-xl hover:scale-110 transform-gpu ease-in-out duration-300">
          <FcPlanner className="text-[48px] text-white mt-13 mb-7 self-center" />
          <h1 className="text-[18px] font-semibold text-center mb-5 text-gray-800">
            Pregled i planiranje obaveza
          </h1>
          <p className="text-[15px] font-light w-[80%] m-auto text-center mt-0  text-gray-700">
            Dodaj, organizuj i prati sve svoje dnevne i nedeljne zadatke na
            jednom mestu. Kalendar ti pomaže da bolje rasporediš vreme i da uvek
            imaš jasan pregled onoga što te čeka.
          </p>
        </div>
        <div className="flex flex-col w-[23%] border border-gray-700 bg-[#fac7d0] rounded-xl border-0 mt-15 shadow-xl hover:scale-110 transform-gpu ease-in-out duration-300">
          <FcAlarmClock className="text-[48px]  mt-13 mb-7 self-center" />
          <h1 className="text-[18px] font-semibold text-center mb-5 text-gray-800">
            Podsetnici za važne datume
          </h1>
          <p className="text-[15px] font-light w-[80%] m-auto text-center mb-15  text-gray-700">
            Nikad ne zaboravi rođendane, rokove ili važne događaje. Kalendar te
            obaveštava na vreme i pomaže da svaki datum ima svoj red i pregled,
            tako da ništa ne promakne.
          </p>
        </div>
        <div className="flex flex-col w-[23%] border border-gray-700 bg-[#fac7d0] rounded-xl border-0 mt-15 shadow-xl hover:scale-110 transform-gpu ease-in-out duration-300">
          <HiOutlineLightningBolt className="text-[48px] mt-10 mb-7 self-center" />
          <h1 className="text-[18px] font-semibold text-center mb-5 text-gray-800">
            Prilagođeno tvom tempu
          </h1>
          <p className="text-[15px] font-light w-[80%] m-auto text-center mb-15  text-gray-700">
            Planiraj kako ti odgovara dnevno, nedeljno ili mesečno. Kalendar ti
            omogućava da prilagodiš raspored svojim navikama i potrebama, tako
            da u svakom trenutku imaš jasan pregled svega.
          </p>
        </div>
      </div>

      <div className="py-20 px-5 text-center w-[85%] m-auto">
        <h2 className="text-3xl font-bold mb-6">
          Jednostavno upravljanje događajima
        </h2>
        <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
          Naš interaktivni kalendar omogućava ti da brzo dodaješ, menjaš i
          brišeš događaje. Sve je pregledno i lako — prati svoje obaveze bez
          stresa.
        </p>

        <div className="flex flex-col md:flex-row justify-evenly items-stretch gap-6">
          <div className="flex flex-col flex-1 bg-gray-50 rounded-xl shadow p-6">
            <span className="text-4xl mb-5 self-center">📝</span>
            <h3 className="text-xl font-semibold mb-3">Dodaj događaj</h3>
            <p className="text-gray-600 mt-auto">
              Kreiraj novi događaj ili zadatak u kalendaru u par klikova. Unesi
              naziv, datum i opis, i prati sve na jednom mestu.
            </p>
          </div>
          <div className="flex flex-col flex-1 bg-gray-50 rounded-xl shadow p-6">
            <span className="text-4xl mb-5 self-center">✏️</span>
            <h3 className="text-xl font-semibold mb-3">Izmeni događaj</h3>
            <p className="text-gray-600 mt-auto">
              Promeni datum, vreme ili detalje postojećeg događaja u trenutku.
              Sve izmene se odmah prikazuju, tako da je raspored uvek ažuran.
            </p>
          </div>

          <div className="flex flex-col flex-1 bg-gray-50 rounded-xl shadow p-6">
            <span className="text-4xl mb-5 self-center">🗑️</span>
            <h3 className="text-xl font-semibold mb-3">Obriši događaj</h3>
            <p className="text-gray-600 mt-0">
              Jednostavno ukloni događaje koji više nisu relevantni. Održava
              kalendar čistim i preglednim.
            </p>
          </div>
        </div>
        <p className="text-gray-700 max-w-5xl mx-auto mt-15 mb-10 text-center">
          Upravljaj svojim vremenom jednostavno i efikasno. Naš interaktivni
          kalendar ti omogućava da planiraš, pratiš i prilagođavaš sve svoje
          obaveze, bez stresa i gubljenja vremena. Probaj sada i uveri se koliko
          može da olakša tvoje svakodnevne aktivnosti.
        </p>
        <div className="mt-6 text-center">
          <Button
            label="Otvori kalendar"
            href="/login"
            variant="register"
            className="py-4"
          />
        </div>
      </div>
    </main>
  );
}
