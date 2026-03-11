import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Coins, Trophy } from "lucide-react";
import { usersCollection } from "@/lib/db/collections";

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  coins: number;
  isCurrentUser: boolean;
}

const RANK_STYLES: Record<number, { badge: string; row: string; text: string }> = {
  1: {
    badge: "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]",
    row: "bg-white/10",
    text: "text-white",
  },
  2: {
    badge: "text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.6)]",
    row: "bg-white/10",
    text: "text-white",
  },
  3: {
    badge: "text-amber-600 drop-shadow-[0_0_6px_rgba(217,119,6,0.6)]",
    row: "bg-white/10",
    text: "text-white",
  },
};

const RANK_MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

const CURRENT_USER_ROW = "bg-yellow-400/90";
const DEFAULT_ROW = "bg-white/5 hover:bg-white/10 transition-colors";

function getRankStyle(rank: number) {
  return RANK_STYLES[rank] ?? { badge: "text-white/50", row: "", text: "text-white" };
}

export default async function LeaderboardPage() {
  const h = await headers();
  const userId = h.get("x-user-id");

  const users = await usersCollection;
  const docs = await users
    .find({}, { projection: { name: 1, coins: 1 } })
    .sort({ coins: -1 })
    .toArray();

  const entries: LeaderboardEntry[] = docs.map((doc, i) => ({
    id: doc._id.toString(),
    rank: i + 1,
    name: doc.name,
    coins: doc.coins,
    isCurrentUser: userId !== null && doc._id.toString() === userId,
  }));

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#1a6db5] to-[#0d3d6b] font-[var(--font-geist-sans)]">
      <div className="mx-auto max-w-lg px-4 py-8">
        <Link
          href="/"
          className="absolute left-4 top-4 rounded-xl bg-white/10 p-2.5 text-white backdrop-blur-sm active:scale-90 transition-transform hover:bg-white/20"
        >
          <ArrowLeft size={22} />
        </Link>

        <div className="relative flex items-center justify-center mb-8 z-1">
          <div className="flex items-center gap-3">
            <Trophy size={28} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
            <h1 className="text-2xl font-bold text-white tracking-wide">Лидерборд</h1>
            <Trophy size={28} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-sm bg-white/5">

          <div className="grid grid-cols-[3rem_1fr_auto] gap-2 px-4 py-3 border-b border-white/20 bg-white/10">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-widest text-center">#</span>
            <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Игрок</span>
            <span className="text-xs font-semibold text-white/50 uppercase tracking-widest flex items-center gap-1">
              <Coins size={12} className="text-yellow-400" />
              Монеты
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="py-16 text-center text-white/50 text-sm">
              Пока никого нет
            </div>
          ) : (
            <ul>
              {entries.map((entry, i) => {
                const rankStyle = getRankStyle(entry.rank);
                const isLast = i === entries.length - 1;
                return (
                  <li
                    key={entry.id}
                    className={[
                      "grid grid-cols-[3rem_1fr_auto] gap-2 items-center px-4 py-3.5",
                      !isLast && "border-b border-white/10",
                      entry.isCurrentUser ? CURRENT_USER_ROW : `${DEFAULT_ROW} ${rankStyle.row}`,
                    ].join(" ")}
                  >
                    <span className={`text-lg font-bold text-center leading-none ${entry.isCurrentUser ? "text-black" : rankStyle.badge}`}>
                      {RANK_MEDALS[entry.rank] ?? entry.rank}
                    </span>

                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`font-semibold truncate leading-none ${entry.isCurrentUser ? "text-black" : rankStyle.text}`}>
                        {entry.name}
                      </span>
                      {entry.isCurrentUser && (
                        <span className="shrink-0 text-xs font-bold bg-black/20 text-black rounded-full px-2 py-0.5">
                          это ты
                        </span>
                      )}
                    </div>

                    <div className={`flex items-center gap-1.5 font-bold tabular-nums ${entry.isCurrentUser ? "text-black" : "text-yellow-400"}`}>
                      <Coins size={16} className={entry.isCurrentUser ? "text-black" : "text-yellow-400"} />
                      {entry.coins.toLocaleString("ru-RU")}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <p className="mt-6 text-center text-white/30 text-xs">
          Монеты обновляются после каждой игры
        </p>
      </div>
    </div>
  );
}
