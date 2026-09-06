import Card from "@/components/ui/card";

export default function BonusLoading() {
    return (
        <Card className="overflow-hidden rounded-3xl p-0">
            <table className="w-full border-collapse">
                <thead className="bg-slate-50">
                    <tr className="text-left text-sm text-slate-500">
                        <th className="px-6 py-4 text-left">Nº</th>
                        <th className="px-6 py-4 text-left">Nome de guerra</th>
                        <th className="px-6 py-4 text-left">Turma</th>
                        <th className="px-6 py-4 text-left">Presença</th>
                        <th className="px-6 py-4 text-left">GIP</th>
                        {/* <th className="px-6 py-4 text-left">Faltas</th> */}
                    </tr>
                </thead>

                <tbody>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <tr
                            key={index}
                            className="border-b"
                        >
                            {Array.from({ length: 5 }).map((_, cell) => (
                                <td
                                    key={cell}
                                    className="px-6 py-4"
                                >
                                    <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}