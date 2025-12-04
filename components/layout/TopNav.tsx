import Link from "next/link";

export function TopNav({ current }: { current: "today" | "tomorrow" | "history" }) {
  const base =
    "flex-1 sm:flex-none px-3 py-2 sm:py-1.5 text-sm sm:text-xs text-center rounded-xl sm:rounded-2xl transition-all duration-200 font-medium";

  return (
    <div className="flex items-center gap-2 mb-4">
      <Link
        href="/"
        className={`${base} ${
          current === "today"
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-200"
            : "text-slate-600 bg-white/50 backdrop-blur-sm border border-white/50 hover:bg-white/70"
        }`}
      >
        今日
      </Link>
      <Link
        href="/tomorrow"
        className={`${base} ${
          current === "tomorrow"
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-200"
            : "text-slate-600 bg-white/50 backdrop-blur-sm border border-white/50 hover:bg-white/70"
        }`}
      >
        明日
      </Link>
      <Link
        href="/history"
        className={`${base} ${
          current === "history"
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-200"
            : "text-slate-600 bg-white/50 backdrop-blur-sm border border-white/50 hover:bg-white/70"
        }`}
      >
        历史
      </Link>
    </div>
  );
}
