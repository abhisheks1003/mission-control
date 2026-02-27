import DashboardHeader from "@/components/DashboardHeader";
import EmailWidget from "@/components/EmailWidget";
import TasksWidget from "@/components/TasksWidget";
import CalendarWidget from "@/components/CalendarWidget";
import WeatherWidget from "@/components/WeatherWidget";
import NewsWidget from "@/components/NewsWidget";

export default function Home() {
  return (
    <main className="mission-bg min-h-screen text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative w-full">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-x-20 top-0 -z-10 h-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <DashboardHeader />

          {/* Main two-column grid */}
          <div className="mission-grid">
            {/* Left column: Email (tall) */}
            <EmailWidget />

            {/* Right column: stacked widgets */}
            <div className="flex flex-col gap-4">
              <WeatherWidget />
              <CalendarWidget />
              <TasksWidget />
            </div>
          </div>

          {/* Full-width news strip */}
          <div className="mt-4">
            <NewsWidget />
          </div>
        </section>
      </div>
    </main>
  );
}
