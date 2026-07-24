import type { BonusRow } from "../types";

import Card from "@/components/ui/card";

import BonusRowComponent from "./bonus_row";

interface BonusTableProps {
    rows: BonusRow[];
}

export default function BonusTable({
    rows,
}: BonusTableProps) {
    return (
        <Card className="overflow-hidden rounded-3xl p-0">
            <table className="w-full table-fixed border-collapse">
                <thead className="bg-slate-50">
                    <tr className="text-left text-sm text-slate-500">
                        <th className="w-20 px-6 py-4">
                            Nº
                        </th>

                        <th className="px-6 py-4">
                            Nome de guerra
                        </th>

                        <th className="w-24 px-6 py-4 text-center">
                            Turma
                        </th>

                        <th className="w-36 px-6 py-4 text-center">
                            Presença
                        </th>

                        <th className="w-24 px-6 py-4 text-center">
                            GIP
                        </th>

                        <th className="w-28 px-6 py-4 text-center">
                            Faltas
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((row) => (
                        <BonusRowComponent
                            key={row.id}
                            row={row}
                        />
                    ))}
                </tbody>
            </table>
        </Card>
    );
}