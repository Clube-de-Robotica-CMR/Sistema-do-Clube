import Card from "@/components/ui/card";

export default function UsersLoading() {
    return (
        <Card className="overflow-hidden rounded-3xl p-0">
            <table className="w-full border-collapse">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left">
                            Nome
                        </th>

                        <th className="px-6 py-4 text-left">
                            Cargo
                        </th>

                        <th className="px-6 py-4" />
                    </tr>
                </thead>

                <tbody>
                    {Array.from({
                        length: 6,
                    }).map((_, index) => (
                        <tr
                            key={index}
                            className="border-t border-slate-100"
                        >
                            <td className="px-6 py-5">
                                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                            </td>

                            <td className="px-6 py-5">
                                <div className="h-7 w-28 animate-pulse rounded-full bg-slate-200" />
                            </td>

                            <td className="px-6 py-5">
                                <div className="flex justify-end gap-2">
                                    <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />

                                    <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
}