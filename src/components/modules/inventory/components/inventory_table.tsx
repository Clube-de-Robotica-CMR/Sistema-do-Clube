import Card from "@/components/ui/card";

import type { InventoryItem } from "@/core/entities/inventory.entity";

import InventoryRow from "./inventory_row";

interface InventoryTableProps {
    items: InventoryItem[];

    onEdit(item: InventoryItem): void;

    onDelete(item: InventoryItem): void;
}

export default function InventoryTable({
    items,
    onEdit,
    onDelete,
}: InventoryTableProps) {
    return (
        <Card className="overflow-hidden">
            <table className="w-full">
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
                    {items.map((item) => (
                        <InventoryRow
                            key={item.id}
                            item={item}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </Card>
    );
}