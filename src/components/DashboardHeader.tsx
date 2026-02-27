"use client";

import { useEffect, useState } from "react";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardHeader() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const hour = now?.getHours() ?? 9;
  const greeting = getGreeting(hour);

  return (
    <header className="mb-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Mission Control</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            {greeting}, Abhi
          </h1>
          {now && (
            <p className="mt-1 text-sm text-slate-400">{formatDate(now)}</p>
          )}
        </div>
        <div className="text-right">
          {now && (
            <p className="font-mono text-4xl font-light tracking-tight text-cyan-200">
              {formatTime(now)}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 h-px bg-gradient-to-r from-cyan-500/30 via-slate-500/20 to-transparent" />
    </header>
  );
}
