import { NeumorphicCard } from "@/components/ui/NeumorphicCard";

type HitokotoResponse = {
  hitokoto: string;
  from: string;
  from_who: string | null;
};

async function getRandomQuote(): Promise<{ content: string; author: string }> {
  try {
    // 一言 API - 获取励志、文学类句子
    // c=k 是励志类，c=d 是文学类，c=i 是诗词
    const res = await fetch("https://v1.hitokoto.cn/?c=k&c=d&c=i&encode=json", {
      next: { revalidate: 3600 }, // 每小时刷新一次
    });
    
    if (!res.ok) throw new Error("API failed");
    
    const data: HitokotoResponse = await res.json();
    return {
      content: data.hitokoto,
      author: data.from_who || data.from || "佚名",
    };
  } catch {
    // 备用名言
    const fallbackQuotes = [
      { content: "不是因为有希望才坚持，而是坚持了才有希望。", author: "佚名" },
      { content: "专注当下，一点点完成你的计划。", author: "佚名" },
      { content: "每天进步一点点，就是成功的开始。", author: "佚名" },
      { content: "行动是治愈恐惧的良药。", author: "佚名" },
    ];
    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  }
}

export async function DailyQuote() {
  const quote = await getRandomQuote();

  return (
    <NeumorphicCard className="p-4 md:p-6 mb-4 sm:mb-6">
      <p className="text-sm text-slate-600 tracking-wide leading-relaxed">
        「{quote.content}」
      </p>
      <p className="text-right text-xs text-slate-400 mt-2">— {quote.author}</p>
    </NeumorphicCard>
  );
}
