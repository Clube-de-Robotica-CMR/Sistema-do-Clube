import z from 'zod';

export const PlacementSchema = z.enum(['1°', '2°', '3°']);

export const CompetitionSchema = z.object({
    id: z.uuid(),
    name: z.string().min(2, 'O nome da competição deve ter pelo menos 2 caracteres'),
    date: z.coerce.date(),
    year: z.number().int().min(2026),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const CompetitionFiltersSchema = CompetitionSchema
    .pick({
        year: true,
    })
    .extend({
        search: z.string(),
    })
    .partial();

export const CreateCompetitionSchema = CompetitionSchema.pick({
    name: true,
    date: true,
});

export const CompetitionResultSchema = z.object({
    id: z.uuid(),
    competition_id: z.uuid(),
    member_war_name: z.string(),
    member_number: z.string().min(4, 'Número do membro é obrigatório'),
    placement: PlacementSchema,
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});


export const SaveCompetitionResultsSchema = z.object({
    competition_id: z.uuid(),
    results: z.array(
        CompetitionResultSchema.omit({ competition_id: true, created_at: true, id: true, updated_at: true })
    ),
});

export type Competition = z.infer<typeof CompetitionSchema>;
export type CompetitionFilters = z.infer<typeof CompetitionFiltersSchema>;
export type CompetitionResult = z.infer<typeof CompetitionResultSchema>;
export type Placement = z.infer<typeof PlacementSchema>;
export type CreateCompetitionDTO = z.infer<typeof CreateCompetitionSchema>;
export type SaveCompetitionResultsDTO = z.infer<typeof SaveCompetitionResultsSchema>;