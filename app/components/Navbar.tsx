"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { usePathname } from "next/navigation";
import Button from "./Button";
import { useAuth } from "./AuthProvider";
import { RiUser3Line } from "react-icons/ri";

const Navbar = () => {
  const pathname = usePathname();

  const { status, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isLoggedIn = status === "authenticated";

  const linkClass = (path: string) =>
    pathname === path
      ? "bg-pink-500 text-white px-4 py-2 rounded-full"
      : "hover:bg-pink-100 hover:text-pink-600 px-4 py-2 rounded-full transition";

  //funkcija za odjavu
  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  return (
    <nav className="w-full flex justify-center mt-10 mb-10 items-center">
      <div className="flex items-stretch gap-60">
        {/*navbar kapsula */}
        <div className="bg-white rounded-full shadow-lg px-8 py-3 flex items-center gap-8 ">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 font-semibold"
          >
            <FiCalendar className="text-xl" />
            Interaktivni kalendar
          </Link>
          <ul className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <li>
              <Link href="/" className={linkClass("/")}>
                Početna
              </Link>
            </li>

            <li>
              <Link href={isLoggedIn ? ("/kalendar") : ("/login")} className={linkClass("/kalendar")}>
               Kalendar
              </Link>
            </li>

            <li>
              <Link href={isLoggedIn ? ("/o-nama") : ("/login")} className={linkClass("/o-nama")}>
                O nama
              </Link>
            </li>
          </ul>
        </div>

        {/*Auth kapsula */}
        <div className="bg-white rounded-full shadow-lg px-8 py-3 flex items-center gap-3 ">
          {/* Ako je korisnik prijavljen, prikazujemo dropdown meni */}
          {isLoggedIn ? (
            <div className="relative z-50 ">
              <button
                aria-label="Profil"
                className="flex h-auto w-auto items-center cursor-pointer justify-center rounded-full  text-pink-600 transition "
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <RiUser3Line className="h-6 w-6 mr-4" />
                <h3 className="font-semibold text-lg">{user.ime} {user.prezime}</h3>
              </button>

              {/* Dropdown meni */}
              <div
                className={`z-50 absolute right-0 top-12 min-w-[200px] rounded-md border border-black/10 bg-white p-2 text-sm shadow-md transition-all ${
                  dropdownOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <span className="block px-2 py-1 text-gray-700 font-medium border-b border-gray-100 mb-1">
                  {user?.ime} {user?.prezime}
                </span>
                <span className="block px-2 py-1 text-xs text-gray-500 mb-2">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block rounded px-2 py-1.5 text-red-600 hover:bg-red-50 font-medium"
                >
                  Odjavi se
                </button>
              </div>
            </div>
          ) : (
            /* Ako nije prijavljen, prikazujemo dugmad za login/register */
            <>
              <Button variant="login" label="Prijavi se" href="/login" />
              <Button
                variant="register"
                label="Registruj se"
                href="/register"
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
