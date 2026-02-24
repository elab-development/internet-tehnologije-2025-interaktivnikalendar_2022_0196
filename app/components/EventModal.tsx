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

interface NotificationItem {
  idNotification: number;
  zakazanoVreme: string;
  status: string;
  vremenskiOffset: number;
  eventNaziv: string;
  eventPocetak: string;
}

// konvertuje UTC ISO string u lokalno datetime-local vrednost (UTC+1)
function utcToLocal(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  // offsetujemo za lokalnu zonu
  const offset = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - offset);
  return local.toISOString().slice(0, 16);
}

// konvertuje lokalni datetime-local string u UTC ISO string
function localToUtc(localString: string): string {
  if (!localString) return "";
  // datetime-local vrednost je u lokalnoj zoni korisnika
  const date = new Date(localString);
  return date.toISOString();
}

// formatuje UTC ISO string za prikaz u lokalnoj zoni
function formatForDisplay(isoString: string): string {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("sr-RS", {
    dateStyle: "short",
    timeStyle: "short",
  });
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
    idCategory: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categories, setCategories] = useState<
    { idCategory: number; naziv: string; boja: string }[]
  >([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [notificationOffset, setNotificationOffset] = useState<number>(0);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
        if (!response.ok) throw new Error(data.error || "Greška pri učitavanju kategorija");
        setCategories(data.category || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [isOpen]);

  // FETCH PODSETNIKA za ovaj dogadjaj (samo update mod)
  const fetchNotifications = async () => {
    if (mode !== "update" || !eventData?.idEvent) return;
    setNotificationsLoading(true);
    try {
      const response = await fetch("/api/notifications", {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      // filtriramo samo podsetniki za ovaj dogadjaj
      const filtered = (data.notifications || []).filter(
        (n: NotificationItem) => n.eventNaziv === eventData.naziv
      );
      setNotifications(filtered);
    } catch (err: any) {
      console.error("Greška pri učitavanju podsetnika:", err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && mode === "update") {
      fetchNotifications();
    }
    if (!isOpen) {
      setNotifications([]);
      setSuccessMessage("");
      setError("");
    }
  }, [isOpen, mode, eventData]);

  // DELETE funkcija
  const handleDelete = async () => {
    if (!eventData?.idEvent) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/events/${eventData.idEvent}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Greška pri brisanju događaja");
      setShowDeleteConfirm(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSetNotification = async () => {
    if (!notificationOffset || !eventData?.idEvent) return;
    setNotificationLoading(true);
    setSuccessMessage("");
    setError("");
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          idEvent: eventData.idEvent,
          vremenskiOffset: notificationOffset,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Greška pri postavljanju podsetnika");
      setSuccessMessage(`✅ Podsetnik postavljen — email stiže ${notificationOffset} min pre događaja`);
      setNotificationOffset(0);
      // osvežimo listu podsetnika
      await fetchNotifications();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setNotificationLoading(false);
    }
  };

  // Popuni formu ako je UPDATE mod — konvertujemo UTC iz baze u lokalno vreme
  useEffect(() => {
    if (mode === "update" && eventData && categories.length > 0) {
      const categoryId = eventData.idCategory === null ? 0 : eventData.idCategory;
      setFormData({
        naziv: eventData.naziv || "",
        pocetakDogadjaja: utcToLocal(eventData.pocetakDogadjaja) || "",
        krajDogadjaja: utcToLocal(eventData.krajDogadjaja) || "",
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
      setNotificationOffset(0);
      setSuccessMessage("");
    }
  }, [mode, eventData, categories, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const url = mode === "create" ? "/api/events" : `/api/events/${eventData?.idEvent}`;
      const method = mode === "create" ? "POST" : "PUT";

      // konvertujemo lokalno vreme u UTC pre slanja na backend
      const payload = {
        naziv: formData.naziv,
        pocetakDogadjaja: localToUtc(formData.pocetakDogadjaja),
        krajDogadjaja: localToUtc(formData.krajDogadjaja),
        opis: formData.opis,
        vazan: formData.vazan,
        privatnost: formData.privatnost,
        idCategory: formData.idCategory || null,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Greška pri ${mode === "create" ? "kreiranju" : "ažuriranju"} događaja`);
      }

      // ako je create mod i korisnik je izabrao podsetnik
      if (mode === "create" && notificationOffset > 0) {
        const newEventId = data.idEvent;
        try {
          const notifResponse = await fetch("/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              idEvent: newEventId,
              vremenskiOffset: notificationOffset,
            }),
          });
          const notifData = await notifResponse.json();
          if (!notifResponse.ok) {
            setSuccessMessage(`⚠️ Događaj kreiran! Podsetnik nije postavljen: ${notifData.error}`);
          } else {
            setSuccessMessage(`✅ Događaj kreiran! Podsetnik postavljen — email stiže ${notificationOffset} min pre događaja`);
          }
        } catch {
          setSuccessMessage("⚠️ Događaj kreiran! Podsetnik nije postavljen zbog greške.");
        }
      }

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
        setNotificationOffset(0);
      }
    } catch (err: any) {
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
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Naziv"
              type="text"
              value={formData.naziv}
              onChange={(e) => setFormData({ ...formData, naziv: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, pocetakDogadjaja: e.target.value })}
              required
              className="bg-white"
            />
          </div>

          <div className="mb-4">
            <Input
              label="Kraj događaja"
              type="datetime-local"
              value={formData.krajDogadjaja}
              onChange={(e) => setFormData({ ...formData, krajDogadjaja: e.target.value })}
              required
              className="bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Opis</label>
            <textarea
              value={formData.opis || ""}
              onChange={(e) => setFormData({ ...formData, opis: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, vazan: e.target.checked })}
                className="mr-2 w-4 h-4"
              />
              <span className="text-sm font-medium">Važan događaj</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Privatnost</label>
            <select
              value={formData.privatnost}
              onChange={(e) => setFormData({ ...formData, privatnost: e.target.value })}
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:border-2 outline-none"
            >
              <option value="privatan">Privatan</option>
              <option value="javan">Javan</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kategorija</label>
            <select
              value={formData.idCategory}
              onChange={(e) => setFormData({ ...formData, idCategory: parseInt(e.target.value) })}
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:border-2 outline-none"
              required
              disabled={categoriesLoading}
            >
              <option value="0">
                {categoriesLoading ? "Učitavanje kategorija..." : "Izaberite kategoriju"}
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

          {/* PODSETNIK */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">🔔 Podsetnik (email)</label>
            <div className="flex gap-2">
              <select
                value={notificationOffset}
                onChange={(e) => setNotificationOffset(parseInt(e.target.value))}
                className="bg-white flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:border-2 outline-none"
              >
                <option value={0}>Bez podsetnika</option>
                <option value={3}>3 minuta pre</option>
                <option value={15}>15 minuta pre</option>
                <option value={30}>30 minuta pre</option>
                <option value={60}>1 sat pre</option>
                <option value={120}>2 sata pre</option>
                <option value={1440}>1 dan pre</option>
              </select>

              {mode === "update" && eventData && (
                <button
                  type="button"
                  onClick={handleSetNotification}
                  disabled={notificationOffset === 0 || notificationLoading}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                >
                  {notificationLoading ? "..." : "Postavi"}
                </button>
              )}
            </div>

            {mode === "create" && notificationOffset > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                📧 Podsetnik će biti automatski postavljen nakon kreiranja događaja
              </p>
            )}
          </div>

          {/* LISTA POSTOJECIH PODSETNIKA (samo update mod) */}
          {mode === "update" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">📋 Postavljeni podsetnici</label>
              {notificationsLoading ? (
                <p className="text-xs text-gray-500">Učitavanje...</p>
              ) : notifications.length === 0 ? (
                <p className="text-xs text-gray-500 italic">Nema postavljenih podsetnika</p>
              ) : (
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.idNotification}
                      className="flex items-center justify-between bg-white px-3 py-2 rounded-lg text-xs border border-gray-200"
                    >
                      <span>
                        🕐 {formatForDisplay(n.zakazanoVreme)} — {n.vremenskiOffset} min pre
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          n.status === "sent"
                            ? "bg-green-100 text-green-700"
                            : n.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {n.status === "sent" ? "poslato" : n.status === "failed" ? "greška" : "čeka"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PORUKE */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

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
              <h3 className="text-lg font-bold text-gray-800 mb-2">Potvrda brisanja</h3>
              <p className="text-gray-600 mb-6">
                Da li ste sigurni da želite da obrišete događaj "{eventData?.naziv}"?
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