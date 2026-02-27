"use client";

import { useCallback, useEffect, useState } from "react";

type Email = {
  id: string;
  from: string;
  fromInitials: string;
  subject: string;
  snippet: string;
  time: string;
  unread: boolean;
  important: boolean;
};

const AVATAR_COLORS = [
  "bg-violet-500/30 text-violet-200",
  "bg-cyan-500/30 text-cyan-200",
  "bg-amber-500/30 text-amber-200",
  "bg-emerald-500/30 text-emerald-200",
  "bg-rose-500/30 text-rose-200",
  "bg-indigo-500/30 text-indigo-200",
  "bg-teal-500/30 text-teal-200",
  "bg-fuchsia-500/30 text-fuchsia-200",
];

function avatarColor(initials: string): string {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function EmailWidget() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async () => {
    try {
      const res = await fetch("/api/emails", { cache: "no-store" });
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setEmails([]);
      } else {
        setEmails(data.emails);
        setError(null);
      }
    } catch {
      setError("Could not reach email API");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 300_000); // 5 min
    return () => clearInterval(interval);
  }, [fetchEmails]);

  const unreadCount = emails.filter((e) => e.unread).length;

  return (
    <section className="glass-panel rounded-3xl p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <p className="widget-header">Gmail</p>
        {!loading && unreadCount > 0 && (
          <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200">
            {unreadCount} unread
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2 flex-1">
        {loading && (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-white/3 p-3 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 rounded bg-slate-700" />
                    <div className="h-3 w-full rounded bg-slate-700/50" />
                    <div className="h-2 w-3/4 rounded bg-slate-700/30" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-center">
            <p className="text-sm text-amber-200">Gmail not connected</p>
            <p className="mt-1 text-xs text-slate-400">{error}</p>
          </div>
        )}

        {!loading && !error && emails.length === 0 && (
          <div className="rounded-xl border border-white/5 bg-white/3 p-4 text-center">
            <p className="text-sm text-slate-300">Inbox zero!</p>
            <p className="mt-1 text-xs text-slate-500">No primary emails to show</p>
          </div>
        )}

        {!loading &&
          !error &&
          emails.map((email) => (
            <article
              key={email.id}
              className={`rounded-xl border p-3 transition-colors ${
                email.unread
                  ? "border-cyan-300/15 bg-cyan-400/5"
                  : "border-white/5 bg-white/3"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor(
                    email.fromInitials,
                  )}`}
                >
                  {email.fromInitials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className={`truncate text-sm ${
                        email.unread ? "font-semibold text-slate-100" : "text-slate-300"
                      }`}
                    >
                      {email.from}
                      {email.important && (
                        <span className="ml-1.5 text-[10px] text-amber-400" title="Important">
                          ★
                        </span>
                      )}
                    </p>
                    <span className="shrink-0 text-[11px] text-slate-500">{email.time}</span>
                  </div>
                  <p className="truncate text-xs text-slate-300 mt-0.5">{email.subject}</p>
                  <p className="mt-1 truncate text-[11px] text-slate-500">{email.snippet}</p>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
