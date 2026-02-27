// Mock data — replace with Google Calendar API when ready

type CalendarEventType = "meeting" | "personal" | "focus" | "deadline";

type CalendarEvent = {
  id: string;
  time: string;
  endTime: string;
  title: string;
  location?: string;
  type: CalendarEventType;
};

const mockEvents: CalendarEvent[] = [
  {
    id: "ev1",
    time: "09:00",
    endTime: "09:30",
    title: "Daily standup",
    location: "Google Meet",
    type: "meeting",
  },
  {
    id: "ev2",
    time: "09:30",
    endTime: "11:00",
    title: "Deep work block — Atlas renewal",
    type: "focus",
  },
  {
    id: "ev3",
    time: "11:30",
    endTime: "12:00",
    title: "1:1 with Sarah",
    location: "Zoom",
    type: "meeting",
  },
  {
    id: "ev4",
    time: "14:00",
    endTime: "15:00",
    title: "Q1 board deck review",
    location: "Conf Room B",
    type: "meeting",
  },
  {
    id: "ev5",
    time: "18:30",
    endTime: "19:30",
    title: "Gym",
    type: "personal",
  },
];

function eventBorderColor(type: CalendarEventType): string {
  const map: Record<CalendarEventType, string> = {
    meeting: "border-l-cyan-400",
    focus: "border-l-violet-400",
    personal: "border-l-amber-400",
    deadline: "border-l-rose-400",
  };
  return map[type];
}

function eventBgColor(type: CalendarEventType): string {
  const map: Record<CalendarEventType, string> = {
    meeting: "bg-cyan-400/5",
    focus: "bg-violet-400/5",
    personal: "bg-amber-400/5",
    deadline: "bg-rose-400/5",
  };
  return map[type];
}

export default function CalendarWidget() {
  return (
    <section className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <p className="widget-header">Today&apos;s Agenda</p>
        <span className="text-xs text-slate-500">{mockEvents.length} events</span>
      </div>
      <div className="mt-4 space-y-2">
        {mockEvents.map((event) => (
          <article
            key={event.id}
            className={`flex items-start gap-3 rounded-xl border-l-2 px-3 py-2.5 ${eventBorderColor(
              event.type,
            )} ${eventBgColor(event.type)} border border-white/5`}
          >
            <div className="shrink-0 text-right">
              <p className="text-xs font-medium text-slate-300">{event.time}</p>
              <p className="text-[10px] text-slate-500">{event.endTime}</p>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">{event.title}</p>
              {event.location && (
                <p className="mt-0.5 truncate text-[11px] text-slate-400">{event.location}</p>
              )}
            </div>
          </article>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-500">Mock data · Google Calendar API coming soon</p>
    </section>
  );
}
