import { InventoryRepository } from '@/core/ports/inventory/inventory_repository';
import { InventoryItem, CreateInventoryItemDTO, InventoryFilter, InventoryClassification, InventoryCollection, InventoryStatus } from '@/core/entities/inventory.entity';
import { inventory_table } from '@/infra/db/schemas/inventory.schema';
import { db } from '@/infra/db/drizzle/client';
import { eq, and, ilike, SQL } from 'drizzle-orm';
import { DBError } from '@/core/errors/db-error';

export class DrizzleInventoryRepository implements InventoryRepository {
    mapToDomain(data: any): InventoryItem {
        return {
            id: data.id,
            item: data.item,
            quantity: data.quantity,
            classification: data.classification as InventoryClassification,
            collection: data.collection as InventoryCollection,
            status: data.status as InventoryStatus,
            location: data.location,
            created_at: data.created_at,
            updated_at: data.updated_at,
        }
    }

    async save(items: CreateInventoryItemDTO): Promise<void> {
        const [result] = await db
            .insert(inventory_table)
            .values(items)
            .returning();

        if (!result) throw new DBError("Erro ao registrar itens no inventário.");
    }

    async get_by_id(id: string): Promise<InventoryItem | null> {
        const [result] = await db
            .select()
            .from(inventory_table)
            .where(eq(inventory_table.id, id))

        return result ? this.mapToDomain(result) : null
    }

    async get_items(filters: InventoryFilter): Promise<InventoryItem[] | null> {
        const conditions: SQL[] = [];

        if (filters.search) {
            conditions.push(
                ilike(inventory_table.item, `%${filters.search}%`)
            );
        }

        if (filters.classification) {
            conditions.push(eq(inventory_table.classification, filters.classification));
        }

        if (filters.collection) {
            conditions.push(eq(inventory_table.collection, filters.collection));
        }

        if (filters.status) {
            conditions.push(eq(inventory_table.status, filters.status));
        }

        if (filters.location) {
            conditions.push(ilike(inventory_table.location, `%${filters.location}%`));
        }

        if (filters.quantity !== undefined) {
            conditions.push(eq(inventory_table.quantity, filters.quantity));
        }

        const results = await db
            .select()
            .from(inventory_table)
            .where(conditions.length > 0 ? and(...conditions) : undefined);

        return results.length > 0 ? results.map(this.mapToDomain) : null;
    }

    async update(data: InventoryItem): Promise<void> {
        const [result] = await db
            .update(inventory_table)
            .set(data)
            .where(eq(inventory_table.id, data.id))
            .returning();

        if (!result) throw new DBError("Item não encontrado para atualização ou erro na persistência.");
    }

    async delete(id: string): Promise<void> {
        const [result] = await db
            .delete(inventory_table)
            .where(eq(inventory_table.id, id))
            .returning();

        if (!result) throw new DBError("Não foi possível deletar o item. Verifique se o ID informado é válido.");
    }
}