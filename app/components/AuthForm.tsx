"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { FormEvent, useState } from "react";
import Link from "next/link";
import Input from "./Input";
import Button from "./Button";

type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { refresh } = useAuth();

  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //funkcija za submit
  const handleSubmit = async (e: FormEvent) => {
    //sprecava default reload
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";

      const body =
        mode === "login"
          ? { email, password }
          : { ime, prezime, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body), //mora u string jer http ne moze da salje json
      });

      if (!res.ok) {
        const data = await res.json();
        const message = data.error || "Greška pri autentifikaciji";
        setError(message);
        return;
      }

      await refresh();

      router.refresh();
      router.push("/");
    } catch (err) {
      setError("Došlo je do greške. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  const title =
    mode === "login" ? "Prijavi se na svoj nalog" : "Napravi novi nalog";
  const buttonLabel = mode === "login" ? "Prijavi se" : "Registruj se";

  const switchText = mode === "login" ? "Nemaš nalog?" : "Već imaš nalog?";
  const switchLinkText = mode === "login" ? "Registruj se" : "Prijavi se";
  const switchHref = mode === "login" ? "/register" : "/login";

  return (
    <div className="flex min-h-full flex-col justify-center  px-6 py-12 lg:px-8 mb-10 ">
      {/* Forma */}
      <div className="w-lg  self-center mt-10 bg-white p-15 rounded-2xl h-auto shadow-2xl">
        {/*Naslov forme*/}
        <h1 className="text-4xl text-center pb-7  font-bold">
          {mode === "register" ? "Registrujte se" : "Prijavite se"}
        </h1>
        {/*Deskripcija forme*/}
        <p className="text-sm text-center pb-8 font-normal text-stone-600">
          {mode === "register"
            ? "Kreiraj svoj nalog brzo i besplatno i uživaj u svim funkcijama aplikacije."
            : "Unesi svoje podatke i pristupi svom personalizovanom kalendaru."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ime i prezime - samo za registraciju */}
          {mode === "register" && (
            <>
              <Input
                label="Ime"
                type="text"
                placeholder="Unesite vaše ime"
                value={ime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setIme(e.target.value)
                }
                required
              />

              <Input
                label="Prezime"
                type="text"
                placeholder="Unesite vaše prezime"
                value={prezime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPrezime(e.target.value)
                }
                required
              />
            </>
          )}

          {/* Email */}
          <Input
            label="Email adresa"
            type="email"
            placeholder="primer@email.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />

          {/* Lozinka */}
          <Input
            label="Lozinka"
            type="password"
            placeholder="Unesite vašu lozinku"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
          />

          {/* Prikaz greške ako postoji */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
              {error}
            </p>
          )}

          {/* Submit dugme */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white hover:bg-pink-600 shadow-pink-200 p-3 rounded-xl text-lg font-bold mt-5 "
          >
            {loading ? "Obrada..." : buttonLabel}
          </button>
        </form>

        {/* Link za prebacivanje između login/register */}
        <p className="mt-10 text-center text-sm text-gray-500">
          {switchText}{" "}
          <Link
            href={switchHref}
            className="font-semibold text-pink-600 hover:text-pink-500"
          >
            {switchLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
