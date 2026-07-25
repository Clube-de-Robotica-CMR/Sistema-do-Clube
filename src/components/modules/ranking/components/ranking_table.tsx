import type { RankingRow } from "../types";
import Card from "@/components/ui/card";
import RankingRowComponent from "./ranking_row";

interface RankingTableProps {
    rows: RankingRow[];
}

export default function RankingTable({ rows }: RankingTableProps) {
    return (
        <Card className="overflow-hidden rounded-3xl p-0 border border-slate-100">
            <table className="w-full border-collapse table-fixed-layout">
                <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-left text-sm font-semibold text-slate-500">
                        <th className="px-6 py-4 whitespace-nowrap w-px">
                            Nº
                        </th>

                        <th className="px-6 py-4">
                            Nome de guerra
                        </th>

                        <th className="px-6 py-4 text-center whitespace-nowrap w-px">
                            Pontuação
                        </th>

                        <th className="px-6 py-4 text-center whitespace-nowrap w-px">
                            Pode ascender?
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                    {rows.map((row, index) => (
                        <RankingRowComponent
                            key={row.member_number}
                            index={index}
                            row={row}
                        />
                    ))}
                </tbody>
            </table>
        </Card>
    );
}

