// Mock data — replace with a real RSS feed or News API when ready

type NewsItem = {
  id: string;
  source: string;
  title: string;
  timeAgo: string;
  url: string;
};

const mockNews: NewsItem[] = [
  {
    id: "n1",
    source: "The Verge",
    title: "OpenAI announces GPT-5 with native multimodal reasoning",
    timeAgo: "23m ago",
    url: "#",
  },
  {
    id: "n2",
    source: "TechCrunch",
    title: "UK startup raises £40M Series B to automate legal document review",
    timeAgo: "1h ago",
    url: "#",
  },
  {
    id: "n3",
    source: "Bloomberg",
    title: "Bank of England holds rates steady for third consecutive meeting",
    timeAgo: "2h ago",
    url: "#",
  },
  {
    id: "n4",
    source: "Hacker News",
    title: "Ask HN: What's your personal dashboard stack in 2026?",
    timeAgo: "3h ago",
    url: "#",
  },
  {
    id: "n5",
    source: "Reuters",
    title: "Global chip shortage easing as TSMC ramps new fabs in Arizona",
    timeAgo: "4h ago",
    url: "#",
  },
];

export default function NewsWidget() {
  return (
    <section className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <p className="widget-header">Headlines</p>
        <span className="text-[11px] text-slate-500">Mock data · RSS coming soon</span>
      </div>
      <div className="mt-4 news-strip">
        {mockNews.map((item) => (
          <a
            key={item.id}
            href={item.url}
            className="news-card group"
            aria-label={`${item.source}: ${item.title}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {item.source}
              </span>
              <span className="shrink-0 text-[10px] text-slate-500">{item.timeAgo}</span>
            </div>
            <p className="mt-2 text-sm font-medium leading-snug text-slate-200 group-hover:text-cyan-200 transition-colors">
              {item.title}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
