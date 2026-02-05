"use client";
import { useState, useEffect } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Button from "./Button";
import EventModal from "./EventModal";
import { Event } from "@/types/event";

interface Category {
  idCategory: number;
  naziv: string;
  boja: string;
}

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

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const years = Array.from({ length: 11 }, (_, i) => 2026 + i);

  const firstDayOfMonth =
    (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; //prvi dan
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); //poslednji dan odnosno broj dana

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(
    undefined,
  );

  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Fetch događaja
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/events", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Greška pri učitavanju događaja");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (data.events && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Greška:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch kategorija
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await fetch("/api/categories", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Greška pri učitavanju kategorija");
      }

      const data = await response.json();
      setCategories(data.category || []);
    } catch (error) {
      console.error("Greška pri učitavanju kategorija:", error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  //za vracanje boje kategorije
  const getCategoryColor = (event: Event): string => {
    if (!event.idCategory) return "#e5e7eb"; 
    
    const category = categories.find(cat => cat.idCategory === event.idCategory);
    return category?.boja || "#e5e7eb";
  };

  // Funkcija za određivanje boje teksta na osnovu pozadine
  const getTextColor = (backgroundColor: string): string => {
    // Konvertuj hex u RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Izracunaj luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Ako je pozadina svetla koristi crni tekst inace beli
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const getEventsForDay = (day: number) => {
    const filtered = events.filter((event) => {
      const eventStart = new Date(event.pocetakDogadjaja);
      const eventDay = eventStart.getDate();
      const eventMonth = eventStart.getMonth();
      const eventYear = eventStart.getFullYear();

      const matches =
        eventDay === day &&
        eventMonth === currentMonth &&
        eventYear === currentYear;

      return matches;
    });

    return filtered;
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const openUpdateModal = (event: Event) => {
    setModalMode("update");
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  function changeMonth() {
    setIsMonthOpen(!isMonthOpen);
    setIsYearOpen(false);
  }

  function changeYear() {
    setIsYearOpen(!isYearOpen);
    setIsMonthOpen(false);
  }

  function nextMonth() {
    if (currentMonth + 1 === 12) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function prevMonth() {
    if (currentYear === 2026 && currentMonth === 0) {
      return;
    }
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 min-h-[85vh]">
      {/*LEVO*/}

      <div className="grid grid-cols-12 gap-8 h-full">
        <div className="col-span-3 border-r border-gray-200 pr-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Događaji</h2>

          {loading ? (
            <p className="text-gray-500 text-sm italic">Učitavanje...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Nema događaja</p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => {
                const categoryColor = getCategoryColor(event);
                const textColor = getTextColor(categoryColor);
                
                return (
                  <div
                    key={event.idEvent}
                    className="p-3 rounded-lg hover:opacity-90 cursor-pointer transition-all"
                    style={{
                      backgroundColor: categoryColor,
                      color: textColor,
                    }}
                    onClick={() => openUpdateModal(event)}
                  >
                    <h3 className="font-semibold">{event.naziv}</h3>
                    <p className="text-xs opacity-90">
                      {new Date(event.pocetakDogadjaja).toLocaleDateString(
                        "sr-RS",
                      )}
                    </p>
                    {event.vazan && (
                      <span className="text-xs font-bold">
                        ⭐ Važan
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/*DESNO*/}
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
                className="text-3xl font-bold text-gray-800 cursor-pointer"
                onClick={changeYear}
              >
                {currentYear}
              </h2>
              <Button
                label="Dodaj događaj"
                variant="register"
                type="button"
                className="ml-10 mt-[-5px]"
                onClick={openCreateModal}
              />
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
                  key={`month-${index}`}
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
                  key={`year-${year}`}
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
            {daysOfWeek.map((day, index) => (
              <div key={`weekday-${index}`}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 flex-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} /> //kreiranje praxnih divova za dane pre prvog
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);

              const isToday =
                day === todayDate &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              return (
                <div
                  key={`day-${i}`}
                  className={`flex flex-col justify-start items-start p-2 border rounded-xl text-sm cursor-pointer transition min-h-[100px]
                    ${isToday ? "border-pink-500 border-4" : "hover:bg-pink-50"}`}
                >
                  <p className="font-bold text-gray-500 text-base mb-1">
                    {day}
                  </p>

                  {dayEvents.length > 0 && (
                    <p className="text-[10px] text-green-600 mb-1">
                      {dayEvents.length} događaj(a)
                    </p>
                  )}

                  <div className="w-full space-y-1">
                    {dayEvents.map((event) => {
                      const categoryColor = getCategoryColor(event);
                      const textColor = getTextColor(categoryColor);
                      
                      return (
                        <div
                          key={event.idEvent}
                          className={`text-xs p-1 rounded truncate ${
                            event.vazan
                              ? "border-2 border-red-500" 
                              : ""
                          }`}
                          style={{
                            backgroundColor: categoryColor,
                            color: textColor,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openUpdateModal(event);
                          }}
                          title={event.naziv}
                        >
                          {event.naziv}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EventModal
          mode={modalMode}
          eventData={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchEvents(); 
            fetchCategories(); 
          }}
        />
      )}
    </div>
  );
}