import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type TaskPriority = "high" | "medium" | "low";
type TaskStatus = "pending" | "done";
type TaskAction = "add" | "update" | "delete";

type Task = {
  id: string;
  title: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
};

type WebhookBody = {
  action: TaskAction;
  task: Task;
};

const TASKS_FILE = path.join(process.cwd(), "data", "tasks.json");

function readTasks(): Task[] {
  try {
    if (!fs.existsSync(TASKS_FILE)) return [];
    const raw = fs.readFileSync(TASKS_FILE, "utf-8");
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

function writeTasks(tasks: Task[]): void {
  fs.mkdirSync(path.dirname(TASKS_FILE), { recursive: true });
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf-8");
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  const tasks = readTasks();
  return NextResponse.json(tasks, { headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  const secret = process.env.TASKS_WEBHOOK_SECRET;
  const authHeader = request.headers.get("authorization");

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: WebhookBody;
  try {
    body = (await request.json()) as WebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, task } = body;
  if (!action || !task?.id) {
    return NextResponse.json({ error: "Missing action or task.id" }, { status: 400 });
  }

  let tasks = readTasks();

  if (action === "add") {
    if (!tasks.find((t) => t.id === task.id)) {
      tasks.push(task);
    }
  } else if (action === "update") {
    tasks = tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t));
  } else if (action === "delete") {
    tasks = tasks.filter((t) => t.id !== task.id);
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  writeTasks(tasks);
  return NextResponse.json({ ok: true, tasks }, { headers: CORS_HEADERS });
}
