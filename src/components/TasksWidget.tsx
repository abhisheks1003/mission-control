"use client";

import { useCallback, useEffect, useState } from "react";

type TaskPriority = "high" | "medium" | "low";
type TaskStatus = "pending" | "done";

type Task = {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
};

function priorityDot(priority: TaskPriority): string {
  if (priority === "high") return "priority-high";
  if (priority === "medium") return "priority-medium";
  return "priority-low";
}

function priorityLabel(priority: TaskPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

export default function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("fetch failed");
      const data = (await res.json()) as Task[];
      setTasks(data.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]));
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 60_000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const toggleTask = async (task: Task) => {
    const newStatus: TaskStatus = task.status === "done" ? "pending" : "done";
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)),
    );
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", task: { ...task, status: newStatus } }),
      });
    } catch {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)),
      );
    }
  };

  const pendingCount = tasks.filter((t) => t.status === "pending").length;

  return (
    <section className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <p className="widget-header">Tasks</p>
        {!loading && pendingCount > 0 && (
          <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-200">
            {pendingCount} pending
          </span>
        )}
      </div>

      <div className="mt-4">
        {loading && (
          <p className="text-sm text-slate-400">Loading tasks…</p>
        )}
        {!loading && error && (
          <p className="text-sm text-rose-300">Could not load tasks. Retrying…</p>
        )}
        {!loading && !error && tasks.length === 0 && (
          <div className="rounded-xl border border-white/5 bg-white/3 p-4 text-center">
            <p className="text-sm text-slate-300">All clear!</p>
            <p className="mt-1 text-xs text-slate-500">Send tasks via Telegram → OpenClaw</p>
          </div>
        )}
        {!loading && !error && tasks.length > 0 && (
          <div className="space-y-2">
            {tasks.map((task) => (
              <article
                key={task.id}
                className={`flex items-start gap-3 rounded-xl border border-white/5 p-3 transition-opacity ${
                  task.status === "done" ? "opacity-50" : ""
                } bg-white/3`}
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task)}
                  aria-label={task.status === "done" ? "Mark pending" : "Mark done"}
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                    task.status === "done"
                      ? "border-emerald-400 bg-emerald-500/30 text-emerald-300"
                      : "border-slate-500 bg-transparent hover:border-emerald-400"
                  }`}
                >
                  {task.status === "done" && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm ${
                      task.status === "done"
                        ? "line-through text-slate-400"
                        : "text-slate-100"
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${priorityDot(task.priority)}`} />
                    <span className="text-[11px] text-slate-500">
                      {priorityLabel(task.priority)} · Due {task.dueDate}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <p className="mt-3 text-[11px] text-slate-500">Updated via OpenClaw webhook · Telegram</p>
    </section>
  );
}
