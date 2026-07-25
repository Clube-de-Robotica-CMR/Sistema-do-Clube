import type {
    CreateInventoryItemDTO,
    InventoryFilter,
    InventoryItem,
    UpdateInventoryItemDTO,
} from "@/core/entities/inventory.entity";

import { rpcClient } from "@/services/api";

export async function findInventoryItems(
    filters: InventoryFilter = {}
) {
    return rpcClient<InventoryItem[]>(
        "inventory",
        "read",
        filters
    );
}

export async function createInventoryItems(
    data: CreateInventoryItemDTO
) {
    return rpcClient<string>(
        "inventory",
        "create",
        data
    );
}

export async function updateInventoryItem(
    data: UpdateInventoryItemDTO
) {
    return rpcClient<string>(
        "inventory",
        "update",
        data
    );
}

export async function deleteInventoryItem(
    id: string
) {
    return rpcClient<string>(
        "inventory",
        "delete",
        { id }
    );
}