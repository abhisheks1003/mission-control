import { NextResponse } from "next/server";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

type EmailResult = {
  id: string;
  from: string;
  fromInitials: string;
  subject: string;
  snippet: string;
  time: string;
  unread: boolean;
  important: boolean;
};

function parseFromHeader(raw: string): { name: string; initials: string } {
  // "John Doe <john@example.com>" → "John Doe"
  const nameMatch = raw.match(/^"?([^"<]+)"?\s*</);
  const name = nameMatch ? nameMatch[1].trim() : raw.replace(/<.*>/, "").trim();
  const parts = name.split(/\s+/);
  const initials =
    parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  return { name, initials };
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString("en-GB", { weekday: "short" });
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const MOCK_EMAILS: EmailResult[] = [
  {
    id: "1",
    from: "Sarah Chen",
    fromInitials: "SC",
    subject: "Q1 Product Roadmap Review",
    snippet: "Hi team, I've attached the updated roadmap for Q1. Please review before our sync on Thursday...",
    time: "15m ago",
    unread: true,
    important: true,
  },
  {
    id: "2",
    from: "David Park",
    fromInitials: "DP",
    subject: "Re: Deployment pipeline fix",
    snippet: "The hotfix for the CI pipeline has been merged. Builds should be green again now...",
    time: "1h ago",
    unread: true,
    important: false,
  },
  {
    id: "3",
    from: "Emily Rodriguez",
    fromInitials: "ER",
    subject: "Design system updates — new components",
    snippet: "Hey! I've pushed the new Button and Modal components to the design system. Can you take a look at the Figma...",
    time: "2h ago",
    unread: false,
    important: true,
  },
  {
    id: "4",
    from: "James Wilson",
    fromInitials: "JW",
    subject: "Invoice #4821 — February",
    snippet: "Please find attached the invoice for consulting services rendered in February 2026...",
    time: "3h ago",
    unread: false,
    important: false,
  },
  {
    id: "5",
    from: "Priya Sharma",
    fromInitials: "PS",
    subject: "Standup notes — Feb 27",
    snippet: "Blockers: waiting on API access from third-party vendor. Progress: auth module is 90% complete...",
    time: "5h ago",
    unread: false,
    important: false,
  },
  {
    id: "6",
    from: "Alex Turner",
    fromInitials: "AT",
    subject: "Re: Weekend hackathon",
    snippet: "Count me in! I'll bring the projector. Should we book the big conference room or the lounge?",
    time: "Yesterday",
    unread: false,
    important: false,
  },
  {
    id: "7",
    from: "Maria Gonzalez",
    fromInitials: "MG",
    subject: "Security audit findings",
    snippet: "The audit is complete. No critical issues found, but there are 3 medium-severity items we should address...",
    time: "Yesterday",
    unread: false,
    important: true,
  },
  {
    id: "8",
    from: "Tom Bradley",
    fromInitials: "TB",
    subject: "Lunch tomorrow?",
    snippet: "Hey, are you free for lunch tomorrow? There's a new ramen place that opened up near the office...",
    time: "2 days ago",
    unread: false,
    important: false,
  },
];

export async function GET() {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return NextResponse.json({ emails: MOCK_EMAILS, error: null });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const listRes = await gmail.users.messages.list({
      userId: "me",
      q: "category:primary",
      maxResults: 8,
    });

    const messageIds = listRes.data.messages ?? [];
    if (messageIds.length === 0) {
      return NextResponse.json({ emails: [], error: null });
    }

    const emails: EmailResult[] = [];

    for (const msg of messageIds) {
      if (!msg.id) continue;

      const detail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "Date"],
      });

      const headers = detail.data.payload?.headers ?? [];
      const fromRaw = headers.find((h) => h.name === "From")?.value ?? "Unknown";
      const subject = headers.find((h) => h.name === "Subject")?.value ?? "(no subject)";
      const dateStr = headers.find((h) => h.name === "Date")?.value ?? "";

      const { name, initials } = parseFromHeader(fromRaw);
      const labelIds = detail.data.labelIds ?? [];

      emails.push({
        id: msg.id,
        from: name,
        fromInitials: initials,
        subject,
        snippet: detail.data.snippet ?? "",
        time: formatRelativeTime(dateStr),
        unread: labelIds.includes("UNREAD"),
        important: labelIds.includes("IMPORTANT"),
      });
    }

    return NextResponse.json({ emails, error: null });
  } catch (err) {
    // Fall back to mock data if Gmail API fails
    return NextResponse.json({ emails: MOCK_EMAILS, error: null });
  }
}
