import { api_handler } from '@/infra/adapters/input/api_handler';
import { create_router } from '@/infra/adapters/input/router';
import { CreateInventoryItemSchema, UpdateInventoryItemSchema, InventoryItemSchema, InventoryFilterSchema } from '@/core/entities/inventory.entity';
import { NotFoundError } from '@/core/errors/domain-errors';
import { require_login } from '@/infra/adapters/input/require_login'; 
import { get_data_from_request } from '@/infra/adapters/input/get_data';
import { DrizzleInventoryRepository } from '@/infra/adapters/output/drizzle/inventory_repository';
import z from 'zod';

const inventoryRepo = new DrizzleInventoryRepository();

const router = create_router({
    'read': async (req, res) => {
        const data = get_data_from_request(req);

        const filters = InventoryFilterSchema.parse(data);

        const items = await inventoryRepo.get_items(filters);

        if (!items) throw new NotFoundError("Itens de inventário não encontrados.");
        
        return res.status(200).json({
            ok: true,
            data: items,
        });
    },

    'create': async (req, res) => {
        const data = get_data_from_request(req);
        const validatedBody = CreateInventoryItemSchema.parse(data);

        await inventoryRepo.save(validatedBody);

        return res.status(200).json({
            ok: true,
            message: 'Itens adicionados ao inventário com sucesso.',
        });
    },

    'update': async (req, res) => {
        const data = get_data_from_request(req);
        const validatedBody = UpdateInventoryItemSchema.parse(data);

        const oldItem = await inventoryRepo.get_by_id(validatedBody.id);
        
        if (!oldItem) {
            throw new NotFoundError("O item solicitado não existe no inventário.");
        }

        const newPackageData = {
            ...oldItem,
            ...validatedBody,
            updated_at: new Date()
        };

        const fullValidatedItem = InventoryItemSchema.parse(newPackageData);

        await inventoryRepo.update(fullValidatedItem);

        return res.status(200).json({
            ok: true,
            message: 'Item do inventário atualizado com sucesso.',
        });
    },

    'delete': async (req, res) => {
        const data = get_data_from_request(req);
        const { id } = z.object({ id: z.uuid('ID inválido') }).parse(data);

        const items = await inventoryRepo.get_by_id(id);
        if (!items) {
            throw new NotFoundError("Item não encontrado no inventário.");
        }

        await inventoryRepo.delete(id);

        return res.status(200).json({
            ok: true,
            message: 'Item removido do inventário com sucesso.',
        });
    }
},
    require_login 
);

export default api_handler(router);