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
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [adding, setAdding] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks", { cache: "no-store" });
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
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)),
      );
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    const newTask: Task = {
      id: `t-${Date.now()}`,
      title,
      priority: newPriority,
      dueDate: new Date().toISOString().slice(0, 10),
      status: "pending",
    };

    // Optimistic update
    setTasks((prev) =>
      [...prev, newTask].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]),
    );
    setNewTitle("");
    setAdding(false);

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", task: newTask }),
      });
    } catch {
      // Revert on failure
      setTasks((prev) => prev.filter((t) => t.id !== newTask.id));
    }
  };

  const pendingCount = tasks.filter((t) => t.status === "pending").length;

  return (
    <section className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="widget-header">Tasks</p>
          <button
            type="button"
            onClick={fetchTasks}
            aria-label="Refresh tasks"
            className="flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white/10 hover:text-slate-300"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M10.5 1.5V4.5H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.34 7.5a4 4 0 1 1-.89-4.12L10.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
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
        {!loading && !error && tasks.length === 0 && !adding && (
          <div className="rounded-xl border border-white/5 bg-white/3 p-4 text-center">
            <p className="text-sm text-slate-300">All clear!</p>
            <p className="mt-1 text-xs text-slate-500">Add a task below or send via Telegram</p>
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

      {/* Add task form */}
      {!loading && !error && (
        <div className="mt-4">
          {!adding ? (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-600 py-2 text-xs text-slate-400 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Add a task
            </button>
          ) : (
            <form onSubmit={addTask} className="space-y-2 rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400/30"
              />
              <div className="flex items-center gap-2">
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300 outline-none focus:border-cyan-400/30"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => { setAdding(false); setNewTitle(""); }}
                  className="rounded-lg px-2.5 py-1 text-xs text-slate-400 transition-colors hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="action-btn disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <p className="mt-3 text-[11px] text-slate-500">Updated via OpenClaw webhook · Telegram</p>
    </section>
  );
}
