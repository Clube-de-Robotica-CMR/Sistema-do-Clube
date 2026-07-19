import { InventoryItem, CreateInventoryItemDTO, InventoryFilter } from '@/core/entities/inventory.entity';

export interface InventoryRepository {
    save(items: CreateInventoryItemDTO): Promise<void>;
    get_by_id(id: string): Promise<InventoryItem | null>;
    get_items(filters: InventoryFilter): Promise<InventoryItem[] | null>;
    update(data: InventoryItem): Promise<void>;
    delete(id: string): Promise<void>;
}