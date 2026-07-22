import Card from "@/components/ui/card";

export default function StudentsLoading() {
    return (
        <Card className="overflow-hidden">
            <table className="w-full">
                <thead className="border-b bg-slate-50">
                    <tr>
                        {[
                            "Nome de Guerra",
                            "Número",
                            "Turma",
                            "Campo",
                            "Nível",
                            ""
                        ].map((title) => (
                            <th
                                key={title}
                                className="px-6 py-4 text-left text-sm font-semibold text-slate-600"
                            >
                                {title}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <tr
                            key={index}
                            className="border-b last:border-none"
                        >
                            {Array.from({ length: 6 }).map((_, cell) => (
                                <td
                                    key={cell}
                                    className="px-6 py-5"
                                >
                                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}