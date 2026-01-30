"use client";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

export default function Kalendar() {
  const daysOfWeek = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];

  const today = new Date();
  const todayDate = today.getDate();
  const months = [
    "Januar",
    "Februar",
    "Mart",
    "April",
    "Maj",
    "Jun",
    "Jul",
    "Avgust",
    "Septembar",
    "Oktobar",
    "Novembar",
    "Decembar",
  ];
  const monthIndex = new Date().getMonth();
  const monthName = months[monthIndex];
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const years = Array.from({ length: 11 }, (_, i) => 2026 + i);
  const firstDayOfMonth =
    (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  function changeMonth() {
    isMonthOpen ? setIsMonthOpen(false) : setIsMonthOpen(true);
    setIsYearOpen(false);
  }

  function changeYear() {
    isYearOpen ? setIsYearOpen(false) : setIsYearOpen(true);
    setIsMonthOpen(false);
  }

  function nextMonth() {
    currentMonth + 1 == 12
      ? changeYearAndMonth()
      : setCurrentMonth(currentMonth + 1);
  }

  function changeYearAndMonth() {
    setCurrentMonth(0);
    setCurrentYear(currentYear + 1);
  }

  function prevMonth() {
    if (currentYear == 2026 && currentMonth == 0) {
      return;
    } else {
      if (currentMonth == 0) {
        setCurrentYear(currentYear - 1);
        setCurrentMonth(11);
        return;
      }
      setCurrentMonth(currentMonth - 1);
    }
  }
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 min-h-[85vh]">
      <div className="grid grid-cols-12 gap-8 h-full">
        {/*ovo 12 je kao 12 kolona, a dole col-span-3 je da levo bude 3 od 12 kolona, a desno col-span-9, da bude 9 od 12 kolona sa desne strane gde je kalendar*/}

        {/*levo*/}
        <div className="col-span-3 border-r border-gray-200 pr-6">
          {/*border-r border-gray-200 za vertikalnu liniju izmedju kolona*/}
          <h2 className="text-xl font-bold text-gray-800 mb-4">Događaji</h2>
          <p className="text-gray-500 text-sm italic">Nema događaja</p>
        </div>

        {/*desno*/}
        <div className="col-span-9 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-row">
              <h2
                className="text-3xl font-bold text-gray-800 mr-4 cursor-pointer"
                onClick={changeMonth}
              >
                {months[currentMonth]}
              </h2>
              <h2
                className="text-3xl font-bold text-gray-800"
                onClick={changeYear}
              >
                {currentYear}
              </h2>
            </div>

            <div className="flex gap-3 text-xl">
              <button onClick={prevMonth}>
                <FaArrowLeft className="text-2xl" />
              </button>
              <button onClick={nextMonth}>
                <FaArrowRight className="text-2xl" />
              </button>
            </div>
          </div>
          {isMonthOpen && (
            <div className="absolute top-55 left-100 bg-white shadow-xl rounded-xl w-40 z-10">
              {months.map((month, index) => (
                <div
                  key={month}
                  className="px-4 py-2 hover:bg-pink-100 cursor-pointer"
                  onClick={() => {
                    setCurrentMonth(index);
                    setIsMonthOpen(false);
                  }}
                >
                  {month}
                </div>
              ))}
            </div>
          )}

          {isYearOpen && (
            <div className="absolute top-55 left-140 bg-white shadow-xl rounded-xl w-32 z-10">
              {years.map((year) => (
                <div
                  key={year}
                  className="px-4 py-2 hover:bg-pink-100 cursor-pointer text-center"
                  onClick={() => {
                    setCurrentYear(year);
                    setIsYearOpen(false);
                  }}
                >
                  {year}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-7 text-center text-gray-500 font-semibold mb-4">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 flex-1">
            {/* prazna polja pre prvog dana */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* dani u mesecu */}
            {Array.from({ length: daysInMonth }, (_, i) => (
              <div
                key={i}
                className={`flex justify-start items-start pt-3 pl-5 pb-25 border rounded-xl p-10 text-sm cursor-pointer transition
    ${
      i + 1 === todayDate &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
        ? "border-pink-500 border-4"
        : "hover:bg-pink-100"
    }`}
              >
                <p className="font-bold text-gray-500 text-base">{i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
