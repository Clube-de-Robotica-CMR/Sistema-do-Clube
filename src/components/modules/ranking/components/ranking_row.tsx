import type { RankingRow } from "../types";

interface RankingRowProps {
    index: number;
    row: RankingRow;
}

export default function RankingRowComponent({ index, row }: RankingRowProps) {
    return (
        <tr className="border-t border-slate-100 hover:bg-slate-50/70 transition-colors">
            {/* whitespace-nowrap adicionado aqui */}
            <td className="px-6 py-4 font-mono text-sm text-slate-500 whitespace-nowrap">
                {row.member_number}
            </td>

            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <p className="font-medium text-slate-900">
                        {row.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
                        <span>🥇 {row.gold_count}</span>
                        <span className="text-slate-300">•</span>
                        <span>🥈 {row.silver_count}</span>
                        <span className="text-slate-300">•</span>
                        <span>🥉 {row.bronze_count}</span>
                    </p>
                </div>
            </td>

            {/* text-center e whitespace-nowrap adicionados aqui */}
            <td className="px-6 py-4 text-center whitespace-nowrap">
                <span className="font-semibold text-violet-700">
                    {row.total_points} pts
                </span>
            </td>

            {/* text-center e whitespace-nowrap adicionados aqui */}
            <td className="px-6 py-4 text-center whitespace-nowrap">
                <span
                    className={
                        row.can_ascend
                            ? "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                            : "inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/10"
                    }
                >
                    {row.can_ascend ? "Pode ascender" : "Não pode ascender"}
                </span>
            </td>
        </tr>
    );
}
