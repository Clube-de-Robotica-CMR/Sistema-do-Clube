import type {
    InventoryStatus,
} from "@/core/entities/inventory.entity";

export function getInventoryStatusColor(
    status: InventoryStatus
) {
    switch (status) {
        case "Funcionando":
            return {
                background:
                    "bg-emerald-100",
                text:
                    "text-emerald-700",
            };

        case "Sem funcionamento":
            return {
                background:
                    "bg-red-100",
                text:
                    "text-red-700",
            };
    }
}

export function getQuantityColor(
    quantity: number
) {
    if (quantity === 0) {
        return {
            background:
                "bg-orange-100",
            text:
                "text-orange-700",
        };
    }

    return {
        background:
            "bg-slate-100",
        text:
            "text-slate-700",
    };
}