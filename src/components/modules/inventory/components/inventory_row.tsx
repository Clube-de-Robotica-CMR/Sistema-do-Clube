import { Pencil, Trash2 } from "lucide-react";

import type { InventoryItem } from "@/core/entities/inventory.entity";

import { getInventoryStatusColor, getQuantityColor } from "../utils";

interface InventoryRowProps {
    item: InventoryItem;

    onEdit(item: InventoryItem): void;

    onDelete(item: InventoryItem): void;
}

export default function InventoryRow({
    item,
    onEdit,
    onDelete,
}: InventoryRowProps) {
    const statusColor = getInventoryStatusColor(item.status);
    const quantityColor = getQuantityColor(item.quantity);

    return (
        <tr className="border-b transition-colors hover:bg-violet-50/40">
            <td className="px-6 py-4 font-medium">
                {item.item}
            </td>

            <td className="px-6 py-4">
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${quantityColor.background} ${quantityColor.text}`}
                >
                    {item.quantity}
                </span>
            </td>

            <td className="px-6 py-4">
                {item.classification}
            </td>

            <td className="px-6 py-4">
                {item.collection}
            </td>

            <td className="px-6 py-4">
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor.background} ${statusColor.text}`}
                >
                    {item.status}
                </span>
            </td>

            <td className="px-6 py-4">
                {item.location}
            </td>

            <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onEdit(item)}
                        className="
                            rounded-xl
                            p-2
                            text-slate-500
                            transition
                            hover:bg-violet-100
                            hover:text-violet-700
                            cursor-pointer
                        "
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        onClick={() => onDelete(item)}
                        className="
                            rounded-xl
                            p-2
                            text-slate-500
                            transition
                            hover:bg-red-100
                            hover:text-red-600
                            cursor-pointer
                        "
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
}