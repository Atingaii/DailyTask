import Link from "next/link";

export function TopNav({ current }: { current: "today" | "tomorrow" | "history" }) {
  const base =
    "flex-1 sm:flex-none px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-center rounded-xl sm:rounded-2xl transition-colors duration-200 font-medium";

  return (
    <div className="flex items-center gap-2 mb-4">
      <Link
        href="/"
        className={`${base} ${
          current === "today"
            ? "bg-blue-500 text-white"
            : "text-slate-500 bg-white border border-slate-200 hover:bg-slate-50"
        }`}
      >
        今日
      </Link>
      <Link
        href="/tomorrow"
        className={`${base} ${
          current === "tomorrow"
            ? "bg-blue-500 text-white"
            : "text-slate-500 bg-white border border-slate-200 hover:bg-slate-50"
        }`}
      >
        明日
      </Link>
      <Link
        href="/history"
        className={`${base} ${
          current === "history"
            ? "bg-blue-500 text-white"
            : "text-slate-500 bg-white border border-slate-200 hover:bg-slate-50"
        }`}
      >
        历史
      </Link>
    </div>
  );
}
