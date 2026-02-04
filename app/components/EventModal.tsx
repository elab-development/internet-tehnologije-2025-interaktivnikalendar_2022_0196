"use client";

import { useEffect, useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { Event } from "@/types/event";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "create" | "update";
  eventData?: Event;
}

export default function EventModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  eventData,
}: EventModalProps) {
  const [formData, setFormData] = useState({
    naziv: "",
    pocetakDogadjaja: "",
    krajDogadjaja: "",
    opis: "",
    vazan: false,
    privatnost: "privatan",
    idCategory: 0, // 0 za frontend = null za backend
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categories, setCategories] = useState<
    { idCategory: number; naziv: string; boja: string }[]
  >([]);

  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // FETCH KATEGORIJA
  useEffect(() => {
    const fetchCategories = async () => {
      if (!isOpen) return;

      setCategoriesLoading(true);
      try {
        const response = await fetch(`/api/categories`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Greška pri učitavanju kategorija");
        }

        setCategories(data.category || []);
      } catch (err: any) {
        console.error("Greška pri učitavanju kategorija:", err);
        setError(err.message);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [isOpen]);

  const formatDateTimeLocal = (isoString: string) => {
    if (!isoString) return "";
    return isoString.slice(0, 16);
  };

  // DELETE funkcija
  const handleDelete = async () => {
    if (!eventData?.idEvent) {
      setError("Nema ID događaja za brisanje");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/events/${eventData.idEvent}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Greška pri brisanju događaja");
      }

      alert("Događaj uspešno obrisan!");
      setShowDeleteConfirm(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Greška pri brisanju:", err);
      setError(err.message);
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  // Popuni formu ako je UPDATE mod
  useEffect(() => {
    if (mode === "update" && eventData && categories.length > 0) {
      //null iz baze u 0 za frontend formu
      const categoryId = eventData.idCategory === null ? 0 : eventData.idCategory;

      setFormData({
        naziv: eventData.naziv || "",
        pocetakDogadjaja: formatDateTimeLocal(eventData.pocetakDogadjaja) || "",
        krajDogadjaja: formatDateTimeLocal(eventData.krajDogadjaja) || "",
        opis: eventData.opis || "",
        vazan: eventData.vazan || false,
        privatnost: eventData.privatnost || "privatan",
        idCategory: categoryId,
      });
    } else if (mode === "create") {
      setFormData({
        naziv: "",
        pocetakDogadjaja: "",
        krajDogadjaja: "",
        opis: "",
        vazan: false,
        privatnost: "privatan",
        idCategory: 0,
      });
    }
  }, [mode, eventData, categories, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url =
        mode === "create" ? "/api/events" : `/api/events/${eventData?.idEvent}`;

      const method = mode === "create" ? "POST" : "PUT";

      //0 iz forme u null za backend
      const payload = {
        naziv: formData.naziv,
        pocetakDogadjaja: formData.pocetakDogadjaja,
        krajDogadjaja: formData.krajDogadjaja,
        opis: formData.opis,
        vazan: formData.vazan,
        privatnost: formData.privatnost,
        idCategory: formData.idCategory || null,
      };

      console.log("Sending payload:", payload);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Greška pri ${mode === "create" ? "kreiranju" : "ažuriranju"} događaja`,
        );
      }

      alert(`Događaj uspešno ${mode === "create" ? "kreiran" : "ažuriran"}!`);
      onSuccess();
      onClose();

      if (mode === "create") {
        setFormData({
          naziv: "",
          pocetakDogadjaja: "",
          krajDogadjaja: "",
          opis: "",
          vazan: false,
          privatnost: "privatan",
          idCategory: 0,
        });
      }
    } catch (err: any) {
      console.error("Greška pri submit-u:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#fac7d0] rounded-lg p-9 w-full max-w-md max-h-[90vh] overflow-y-auto border border-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {mode === "create" ? "Dodaj novi događaj" : "Izmeni događaj"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Naziv"
              type="text"
              value={formData.naziv}
              onChange={(e) =>
                setFormData({ ...formData, naziv: e.target.value })
              }
              placeholder="Unesite naziv dogadjaja"
              required
              className="bg-white"
            />
          </div>

          <div className="mb-4">
            <Input
              label="Početak događaja"
              type="datetime-local"
              value={formData.pocetakDogadjaja}
              onChange={(e) =>
                setFormData({ ...formData, pocetakDogadjaja: e.target.value })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="mb-4">
            <Input
              label="Kraj događaja"
              type="datetime-local"
              value={formData.krajDogadjaja}
              onChange={(e) =>
                setFormData({ ...formData, krajDogadjaja: e.target.value })
              }
              required
              className="bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Opis</label>
            <textarea
              value={formData.opis || ""}
              onChange={(e) =>
                setFormData({ ...formData, opis: e.target.value })
              }
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:border-2 outline-none"
              rows={3}
              placeholder="Opcionalno"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.vazan}
                onChange={(e) =>
                  setFormData({ ...formData, vazan: e.target.checked })
                }
                className="mr-2 w-4 h-4"
              />
              <span className="text-sm font-medium">Važan događaj</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Privatnost</label>
            <select
              value={formData.privatnost}
              onChange={(e) =>
                setFormData({ ...formData, privatnost: e.target.value })
              }
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:border-2 outline-none"
            >
              <option value="privatan">Privatan</option>
              <option value="javan">Javan</option>
            </select>
          </div>

          {/* Kategorija */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kategorija</label>
            <select
              value={formData.idCategory}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  idCategory: parseInt(e.target.value),
                })
              }
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:border-2 outline-none"
              required
              disabled={categoriesLoading}
            >
              <option value="0">
                {categoriesLoading
                  ? "Učitavanje kategorija..."
                  : "Izaberite kategoriju"}
              </option>
              {categories
                .filter((cat) => cat && cat.idCategory != null)
                .map((cat) => (
                  <option key={cat.idCategory} value={cat.idCategory}>
                    {cat.naziv}
                  </option>
                ))}
            </select>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="flex gap-3 justify-between">
            {mode === "update" && eventData && (
              <Button
                label="Obriši"
                onClick={() => setShowDeleteConfirm(true)}
                variant="login"
                type="button"
                className="w-[30%] bg-red hover:bg-red-300 text-black"
                disabled={loading}
              />
            )}

            <Button
              label="Otkaži"
              onClick={onClose}
              variant="login"
              type="button"
              className={mode === "update" ? "w-[35%]" : "w-[50%]"}
              disabled={loading}
            />

            <Button
              label={mode === "create" ? "Kreiraj događaj" : "Ažuriraj događaj"}
              variant="register"
              type="submit"
              className={mode === "update" ? "w-[35%]" : "w-[50%]"}
              disabled={loading}
            />
          </div>
        </form>

        {/* CONFIRMATION DIALOG za brisanje */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-transparent flex items-center justify-center z-[60]"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Potvrda brisanja
              </h3>
              <p className="text-gray-600 mb-6">
                Da li ste sigurni da želite da obrišete događaj "
                {eventData?.naziv}"?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Otkaži
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  disabled={loading}
                >
                  {loading ? "Brisanje..." : "Obriši"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}