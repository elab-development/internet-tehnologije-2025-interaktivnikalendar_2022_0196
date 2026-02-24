"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// registracija Chart.js komponenti
ChartJS.register(   //register nam omogucava da koristimo ove komponente za prikaz
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface CategoryStat {
  naziv: string;
  boja: string;
  count: number;
}

interface Stats {
  eventsByMonth: number[];
  eventsByCategory: CategoryStat[];
  total: number;
}

const MESECI = [
  "Januar", "Februar", "Mart", "April", "Maj", "Jun",
  "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar",
];

export default function StatistikePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/stats", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setStats(data);
        }
      })
      .catch(() => setError("Greška pri učitavanju statistike"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Učitavanje statistike...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  // podaci za bar chart — događaji po mesecima
  const barData = {
    labels: MESECI,
    datasets: [
      {
        label: "Broj događaja",
        data: stats.eventsByMonth,
        backgroundColor: "#fac7d0",
        borderColor: "#f472b6",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Broj događaja po mesecima",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  // filtriramo kategorije koje imaju bar jednu događaj
  const activeCats = stats.eventsByCategory.filter((c) => c.count > 0);

  // podaci za pie chart — događaji po kategorijama
  const pieData = {
    labels: activeCats.map((c) => c.naziv),
    datasets: [
      {
        data: activeCats.map((c) => c.count),
        backgroundColor: activeCats.map((c) => c.boja),
        borderColor: activeCats.map(() => "#fff"),
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right" as const },
      title: {
        display: true,
        text: "Događaji po kategorijama",
        font: { size: 16 },
      },
    },
  };

  return (
    <div className="min-h-screen bg-transparent py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Statistike</h1>
        <p className="text-gray-500 mb-8">
          Ukupno događaja: <span className="font-semibold text-gray-700">{stats.total}</span>
        </p>

        <div className="grid grid-cols-1 gap-8">
          {/* Bar chart — po mesecima */}
          <div className="bg-white rounded-2xl shadow p-6">
            <Bar data={barData} options={barOptions} />
          </div>

          {/* Pie chart — po kategorijama */}
          <div className="bg-white rounded-2xl shadow p-6">
            {activeCats.length === 0 ? (
              <p className="text-center text-gray-400 py-10">
                Nema događaja sa kategorijama za prikaz
              </p>
            ) : (
              <div className="max-w-md mx-auto">
                <Pie data={pieData} options={pieOptions} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}