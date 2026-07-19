import z from 'zod';

export const InventoryClassificationSchema = z.enum(
    [
        'Microcontrolador', 'Atuador', 'Componente Mecânico', 'Sensor', 'Conector', 
        'Energia', 'Variados', 'Dispositivo de saída'
    ]
)
export const InventoryCollectionSchema = z.enum(['Arduino', 'LEGO SPIKE', 'LEGO EV3'])
export const InventoryStatusSchema = z.enum(['Funcionando', 'Sem funcionamento']);

export const InventoryItemSchema = z.object({
    id: z.uuid(),
    item: z.string().min(2, 'O nome do item deve ter pelo menos 2 caracteres'),
    quantity: z.number().int().min(0, 'A quantidade não pode ser negativa'),
    classification: InventoryClassificationSchema,
    collection: InventoryCollectionSchema,
    status: InventoryStatusSchema,
    location: z.string().min(2, 'A localização é obrigatória'),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const InventoryFilterSchema = InventoryItemSchema
    .omit({
        id: true,
        item: true,
        created_at: true,
        updated_at: true,
    })
    .extend({
        search: z.string(),
    })
    .partial()

export const CreateInventoryItemSchema = z.array(InventoryItemSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
}));

export const UpdateInventoryItemSchema = InventoryItemSchema
    .omit({
        id: true,
        created_at: true,
        updated_at: true,
    })
    .partial()
    .extend({
        id: z.uuid('ID inválido')
    });

export type InventoryItem = z.infer<typeof InventoryItemSchema>;
export type InventoryFilter = z.infer<typeof InventoryFilterSchema>;
export type CreateInventoryItemDTO = z.infer<typeof CreateInventoryItemSchema>;
export type UpdateInventoryItemDTO = z.infer<typeof UpdateInventoryItemSchema>;
export type InventoryClassification = z.infer<typeof InventoryClassificationSchema>;
export type InventoryCollection = z.infer<typeof InventoryCollectionSchema>;
export type InventoryStatus = z.infer<typeof InventoryStatusSchema>;