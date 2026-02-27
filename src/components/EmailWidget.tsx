// Mock data — replace with Gmail API (googleapis) when ready

type Email = {
  id: string;
  from: string;
  fromShort: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
};

const mockEmails: Email[] = [
  {
    id: "e1",
    from: "Sarah Chen",
    fromShort: "SC",
    subject: "Q1 board deck — feedback needed by EOD",
    preview: "Hi Abhi, attaching the updated slides. Please leave comments on slides 4 and 9...",
    time: "08:14",
    unread: true,
  },
  {
    id: "e2",
    from: "Stripe",
    fromShort: "ST",
    subject: "Your February invoice is ready",
    preview: "Your invoice for £2,340.00 is available in the dashboard. Payment due 7 Mar...",
    time: "07:52",
    unread: true,
  },
  {
    id: "e3",
    from: "James Okafor",
    fromShort: "JO",
    subject: "Re: Atlas renewal — counter-proposal",
    preview: "Thanks for the call yesterday. We can do 18 months at the rate discussed...",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "e4",
    from: "GitHub",
    fromShort: "GH",
    subject: "[mission-control] New pull request opened",
    preview: "abhisheks1003 opened pull request #12: improve dashboard design...",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "e5",
    from: "Linear",
    fromShort: "LN",
    subject: "3 issues assigned to you this week",
    preview: "You have been assigned: ENG-204, ENG-211, ENG-218. Check the sprint board...",
    time: "Mon",
    unread: false,
  },
];

const unreadCount = mockEmails.filter((e) => e.unread).length;

function avatarColor(initials: string): string {
  const colors: Record<string, string> = {
    SC: "bg-violet-500/30 text-violet-200",
    ST: "bg-cyan-500/30 text-cyan-200",
    JO: "bg-amber-500/30 text-amber-200",
    GH: "bg-slate-500/30 text-slate-200",
    LN: "bg-emerald-500/30 text-emerald-200",
  };
  return colors[initials] ?? "bg-slate-500/30 text-slate-200";
}

export default function EmailWidget() {
  return (
    <section className="glass-panel rounded-3xl p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <p className="widget-header">Gmail</p>
        {unreadCount > 0 && (
          <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-200">
            {unreadCount} unread
          </span>
        )}
      </div>
      <div className="mt-4 space-y-2 flex-1">
        {mockEmails.map((email) => (
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
                  email.fromShort,
                )}`}
              >
                {email.fromShort}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p
                    className={`truncate text-sm ${
                      email.unread ? "font-semibold text-slate-100" : "text-slate-300"
                    }`}
                  >
                    {email.from}
                  </p>
                  <span className="shrink-0 text-[11px] text-slate-500">{email.time}</span>
                </div>
                <p className="truncate text-xs text-slate-300 mt-0.5">{email.subject}</p>
                <p className="mt-1 truncate text-[11px] text-slate-500">{email.preview}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-500">Mock data · Gmail API coming soon</p>
    </section>
  );
}
