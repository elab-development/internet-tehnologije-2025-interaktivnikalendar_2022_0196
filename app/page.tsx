

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fac7d0] flex items-center justify-center">
      
      <section className="container mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start min-h-[10vh]">

          <div className="space-y-5">
            <h1 className="text-6xl font-bold text-gray-800 leading-tight">

              Organizujte svoj život<br />
              sa lakoćom

            </h1>

            <p className="text-xl text-gray-700 leading-relaxed">
              Pratite sve važne događaje, postavite podsetnike<br />
              i nikada ne propustite nijednu obavezu.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              Bilo da planirate sastanke, rok projekata ili lične događaje,
              naš interaktivni kalendar vam omogućava da sveimate na jednom mestu.
              Počnite danas i preuzmite kontrolu nad svojim rasporedom!
            </p>

            <button className="px-10 py-4 bg-[#e91e8c] text-white rounded-full text-lg font-semibold hover:bg-[#d1197a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">Dodaj dogadjaj</button>

          </div>

          <div className="relative max-w-lg mx-auto">
            
            <div className="bg-white rounded-[3rem] shadow-2xl p-4 transform hover:scale-105 transition-transform duration-300">

              <div className="aspect-[3/4] bg-gradient-to-br from-pink-200 to-pink-300 rounded-[2rem] flex items-center justify-center">
                <img
                  src="/images/kalendar.jpg"
                  alt="Kalendar"
                  className="w-full h-full object-cover rounded-[2rem]"
                />
              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
