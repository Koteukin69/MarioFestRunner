"use client";

import { useState, FormEvent } from "react";

export default function NameForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Произошла ошибка");
        return;
      }

      window.location.reload();
    } catch {
      setError("Не удалось подключиться к серверу");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center w-screen h-dvh bg-background">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm px-6"
      >
        <h1 className="text-2xl font-bold text-center">Марио Раннер</h1>
        <input
          type="text"
          placeholder="Введите ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          required
          disabled={loading}
          className="border rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50"
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading || name.trim().length === 0}
          className="bg-black text-white rounded-xl px-4 py-3 text-base font-medium active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
        >
          {loading ? "Загрузка..." : "Начать игру"}
        </button>
      </form>
    </div>
  );
}
