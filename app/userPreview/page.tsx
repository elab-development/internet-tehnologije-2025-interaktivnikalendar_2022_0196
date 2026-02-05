"use client";

import { useEffect, useState } from "react";

interface User {
  idUser: number;
  ime: string;
  prezime: string;
  email: string;
  userRole: string;
}

export default function UserPreview() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch("/api/admin/users", {
          credentials: "include",
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error);
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getUsers();
  }, []);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p>Greška: {error}</p>;

  return (
    <div className="min-h-screen bg-transparent p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md">
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-semibold text-gray-800">
            Svi korisnici
          </h1>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Ime</th>
                <th className="px-6 py-3 text-left">Prezime</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Uloga</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.idUser}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50 transition`}
                >
                  <td className="px-6 py-4">{user.ime}</td>
                  <td className="px-6 py-4">{user.prezime}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.userRole === "ADMIN"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.userRole}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
