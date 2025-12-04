import { NeumorphicCard } from "@/components/ui/NeumorphicCard";

// 毛主席经典语录
const maoQuotes = [
  { content: "世界是你们的，也是我们的，但是归根结底是你们的。", author: "毛泽东" },
  { content: "好好学习，天天向上。", author: "毛泽东" },
  { content: "一万年太久，只争朝夕。", author: "毛泽东" },
  { content: "自己动手，丰衣足食。", author: "毛泽东" },
  { content: "世上无难事，只要肯登攀。", author: "毛泽东" },
  { content: "人民，只有人民，才是创造世界历史的动力。", author: "毛泽东" },
  { content: "虚心使人进步，骄傲使人落后。", author: "毛泽东" },
  { content: "星星之火，可以燎原。", author: "毛泽东" },
  { content: "没有调查，没有发言权。", author: "毛泽东" },
  { content: "下定决心，不怕牺牲，排除万难，去争取胜利。", author: "毛泽东" },
  { content: "革命不是请客吃饭，不是做文章。", author: "毛泽东" },
  { content: "人不犯我，我不犯人；人若犯我，我必犯人。", author: "毛泽东" },
  { content: "为有牺牲多壮志，敢教日月换新天。", author: "毛泽东" },
  { content: "不到长城非好汉。", author: "毛泽东" },
  { content: "数风流人物，还看今朝。", author: "毛泽东" },
  { content: "雄关漫道真如铁，而今迈步从头越。", author: "毛泽东" },
  { content: "与天奋斗，其乐无穷；与地奋斗，其乐无穷；与人奋斗，其乐无穷。", author: "毛泽东" },
];

function getRandomMaoQuote() {
  return maoQuotes[Math.floor(Math.random() * maoQuotes.length)];
}

export async function DailyQuote() {
  const quote = getRandomMaoQuote();

  return (
    <div className="relative mb-4 sm:mb-6 p-5 md:p-8 rounded-2xl bg-gradient-to-br from-zinc-900 via-neutral-900 to-stone-900 border border-red-900/30 shadow-[0_0_40px_rgba(220,38,38,0.15)]">
      {/* 装饰线条 */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
      <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
      
      {/* 毛笔字引用 */}
      <p 
        className="text-xl sm:text-2xl md:text-3xl text-red-500 tracking-widest leading-relaxed text-center"
        style={{ fontFamily: "var(--font-brush), 'KaiTi', 'STKaiti', serif" }}
      >
        「{quote.content}」
      </p>
      
      {/* 作者 */}
      <p 
        className="text-right text-sm text-red-400/70 mt-4"
        style={{ fontFamily: "var(--font-brush), 'KaiTi', 'STKaiti', serif" }}
      >
        —— {quote.author}
      </p>
      
      {/* 装饰印章效果 */}
      <div className="absolute -bottom-2 -right-2 w-12 h-12 opacity-20">
        <div className="w-full h-full rounded border-2 border-red-600 flex items-center justify-center text-red-600 text-xs rotate-12"
          style={{ fontFamily: "var(--font-brush), serif" }}>
          印
        </div>
      </div>
    </div>
  );
}
