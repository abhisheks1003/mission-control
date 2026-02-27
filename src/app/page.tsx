type BriefItem = {
  id: string;
  label: string;
  value: string;
  trend: "up" | "down" | "flat";
};

type PriorityMove = {
  id: string;
  title: string;
  owner: string;
  timeBlock: string;
  status: "ready" | "in-progress" | "blocked";
};

type LoopStage = {
  id: string;
  label: string;
  owner: string;
  status: "done" | "active" | "queued" | "blocked";
  note: string;
};

type SprintTag = {
  id: string;
  label: string;
  tone: "info" | "warn" | "danger";
};

const tractionData = {
  quickStatus: {
    label: "Momentum",
    state: "Stable",
    pulse: "Calm",
  },
  northStar: {
    metric: "Qualified Pipeline",
    todayTarget: "$48k",
    now: "$31.4k",
    delta: "+12% vs yesterday",
  },
  morningBrief: [
    {
      id: "pipeline",
      label: "Pipeline Added",
      value: "$8.6k",
      trend: "up",
    },
    {
      id: "focus-hours",
      label: "Focus Hours Blocked",
      value: "4.5h",
      trend: "flat",
    },
    {
      id: "risk-alerts",
      label: "Risk Alerts",
      value: "2",
      trend: "down",
    },
  ] satisfies BriefItem[],
  topMoves: [
    {
      id: "move-1",
      title: "Close Atlas renewal sequence",
      owner: "Abhi",
      timeBlock: "09:30 - 11:00",
      status: "in-progress",
    },
    {
      id: "move-2",
      title: "Publish onboarding v2 checklist",
      owner: "Ops",
      timeBlock: "11:30 - 12:15",
      status: "ready",
    },
    {
      id: "move-3",
      title: "Resolve billing escalation queue",
      owner: "Support",
      timeBlock: "14:00 - 15:00",
      status: "blocked",
    },
  ] satisfies PriorityMove[],
};

const buildLoopData = {
  sprint: {
    item: "Launch AI-assisted onboarding flow for Week 9 cohort",
    blocker: "Waiting on legal approval for screenshot examples in onboarding docs.",
  },
  stages: [
    {
      id: "idea",
      label: "Idea",
      owner: "Abhi",
      status: "done",
      note: "Hypothesis validated with 6 support call transcripts.",
    },
    {
      id: "agent",
      label: "Agent",
      owner: "Mina",
      status: "active",
      note: "Prompt guardrails tuned, evaluation pass rate at 82%.",
    },
    {
      id: "integration",
      label: "Integration",
      owner: "Dev",
      status: "queued",
      note: "Webhook wiring starts once final schema is approved.",
    },
    {
      id: "content",
      label: "Content",
      owner: "Ops",
      status: "blocked",
      note: "Final screenshots pending legal review outcome.",
    },
  ] satisfies LoopStage[],
  tags: [
    { id: "in-flight", label: "In Flight", tone: "info" },
    { id: "legal-risk", label: "Legal Risk", tone: "warn" },
    { id: "today", label: "Due Today", tone: "danger" },
  ] satisfies SprintTag[],
  quickActions: [
    { id: "nudge-owner", label: "Nudge Owner" },
    { id: "log-blocker", label: "Log Blocker" },
    { id: "ship-note", label: "Ship Note" },
  ],
};

function QuickIndicatorPlaceholder() {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
        Quick Indicator
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
        <div>
          <p className="text-sm font-medium text-slate-100">
            {tractionData.quickStatus.label}: {tractionData.quickStatus.state}
          </p>
          <p className="text-xs text-slate-400">Pulse: {tractionData.quickStatus.pulse}</p>
        </div>
      </div>
    </div>
  );
}

function trendDot(trend: BriefItem["trend"]) {
  if (trend === "up") return "bg-emerald-300";
  if (trend === "down") return "bg-rose-300";
  return "bg-slate-400";
}

function moveStatusPill(status: PriorityMove["status"]) {
  if (status === "ready") return "bg-emerald-500/20 text-emerald-200";
  if (status === "blocked") return "bg-rose-500/20 text-rose-200";
  return "bg-cyan-500/20 text-cyan-200";
}

function stageStatusPill(status: LoopStage["status"]) {
  if (status === "done") return "bg-emerald-500/20 text-emerald-100";
  if (status === "active") return "bg-cyan-500/20 text-cyan-100";
  if (status === "blocked") return "bg-rose-500/20 text-rose-100";
  return "bg-slate-500/20 text-slate-200";
}

function sprintTagTone(tone: SprintTag["tone"]) {
  if (tone === "warn") return "bg-amber-500/15 text-amber-100 border border-amber-300/20";
  if (tone === "danger") return "bg-rose-500/15 text-rose-100 border border-rose-300/20";
  return "bg-cyan-500/15 text-cyan-100 border border-cyan-300/20";
}

export default function Home() {
  return (
    <main className="mission-bg min-h-screen text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-start justify-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative w-full max-w-5xl">
          <div className="pointer-events-none absolute inset-x-20 top-0 -z-10 h-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <header className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Mission Control
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Daily Traction Panel
            </h1>
          </header>

          <div className="mission-grid">
            <section className="glass-panel rounded-3xl p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Build Loop Tracker</p>
              <div className="mt-4 rounded-2xl border border-cyan-200/10 bg-cyan-400/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current Sprint Item</p>
                <p className="mt-2 text-base font-semibold text-slate-50">{buildLoopData.sprint.item}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {buildLoopData.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${sprintTagTone(
                        tag.tone,
                      )}`}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-rose-200">
                  Blocker Note: <span className="text-slate-200">{buildLoopData.sprint.blocker}</span>
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {buildLoopData.stages.map((stage) => (
                  <article
                    key={stage.id}
                    className="rounded-xl border border-white/5 bg-white/5 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{stage.label}</p>
                        <p className="mt-1 text-xs text-slate-400">Owner: {stage.owner}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${stageStatusPill(
                          stage.status,
                        )}`}
                      >
                        {stage.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">{stage.note}</p>
                  </article>
                ))}
              </div>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quick Actions</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {buildLoopData.quickActions.map((action) => (
                    <button key={action.id} type="button" className="action-btn">
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <section className="glass-panel rounded-3xl p-5 md:col-span-2 xl:col-span-1">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Morning Brief Snapshot
                </p>
                <div className="mt-4 space-y-3">
                  {tractionData.morningBrief.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-xl border border-white/5 bg-white/5 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-slate-300">{item.label}</p>
                        <span className={`h-2 w-2 rounded-full ${trendDot(item.trend)}`} />
                      </div>
                      <p className="mt-1 text-lg font-semibold text-slate-50">{item.value}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="glass-panel rounded-3xl p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Today&apos;s North Star
                </p>
                <div className="mt-4 rounded-2xl border border-cyan-200/10 bg-cyan-400/5 p-4">
                  <p className="text-sm text-slate-300">{tractionData.northStar.metric}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-cyan-100">
                    {tractionData.northStar.now}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Target: {tractionData.northStar.todayTarget}
                  </p>
                  <p className="mt-2 text-xs font-medium text-emerald-200">
                    {tractionData.northStar.delta}
                  </p>
                </div>
                <div className="mt-4">
                  <QuickIndicatorPlaceholder />
                </div>
              </section>

              <section className="glass-panel rounded-3xl p-5 md:col-span-2 xl:col-span-1">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Top 3 Moves</p>
                <div className="mt-4 space-y-3">
                  {tractionData.topMoves.map((move, index) => (
                    <article
                      key={move.id}
                      className="rounded-xl border border-white/5 bg-white/5 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-slate-100">
                          {index + 1}. {move.title}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${moveStatusPill(
                            move.status,
                          )}`}
                        >
                          {move.status}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        {move.owner} · {move.timeBlock}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
