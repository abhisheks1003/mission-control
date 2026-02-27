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

export async function GET() {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return NextResponse.json({
      emails: [],
      error: "Gmail not configured — add GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN to .env.local",
    });
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
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ emails: [], error: `Gmail API error: ${message}` });
  }
}
