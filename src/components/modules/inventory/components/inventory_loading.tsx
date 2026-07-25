import Card from "@/components/ui/card";

export default function InventoryLoading() {
    return (
        <Card className="overflow-hidden rounded-3xl p-0">
            <table className="w-full border-collapse">
                <thead className="border-b bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Item
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Quantidade
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Classificação
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Coleção
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Status
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                            Localização
                        </th>

                        <th className="w-32 px-6 py-4" />
                    </tr>
                </thead>

                <tbody>
                    {Array.from({ length: 8 }).map(
                        (_, index) => (
                            <tr
                                key={index}
                                className="border-t border-slate-100"
                            >

                                <td className="px-6 py-5">
                                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                                </td>

                                <td className="px-6 py-5">
                                    <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                                </td>

                                <td className="px-6 py-5">
                                    <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                                </td>

                                <td className="px-6 py-5">
                                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                                </td>

                                <td className="px-6 py-5">
                                    <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                                </td>

                                <td className="px-6 py-5">
                                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                                </td>

                                <td className="px-6 py-5">
                                    <div className="ml-auto flex justify-end gap-2">
                                        <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />

                                        <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />
                                    </div>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </Card>
    );
}