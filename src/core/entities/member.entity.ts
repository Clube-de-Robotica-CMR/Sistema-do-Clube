import z from "zod";

export const levelSchema = z.enum([
    "Nível B",
    "Nível A",
    "Indefinido",
]);

export const fieldSchema = z.enum([
    "Programação",
    "Mecatrônica",
    "Indefinido",
]);

export type MemberLevel =
    z.infer<typeof levelSchema>;

export type MemberField =
    z.infer<typeof fieldSchema>;


/* =========================
   Groups
========================= */

export const GroupSchema = z.object({
    id: z.uuid("ID inválido ou obrigatório."),

    name: z
        .string()
        .trim()
        .min(1, "O nome do grupo é obrigatório."),

    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const CreateGroupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "O nome do grupo é obrigatório."),

    member_ids: z
        .array(z.uuid("ID de membro inválido."))
        .default([]),
});

export const UpdateGroupSchema = z
    .object({
        id: z.uuid("ID inválido ou obrigatório."),

        name: z
            .string()
            .trim()
            .min(1, "O nome do grupo é obrigatório.")
            .optional(),

        member_ids: z
            .array(z.uuid("ID de membro inválido."))
            .optional(),
    });

export type Group =
    z.infer<typeof GroupSchema>;

export type CreateGroupDTO =
    z.infer<typeof CreateGroupSchema>;

export type UpdateGroupDTO =
    z.infer<typeof UpdateGroupSchema>;

export interface GroupWithMembers extends Group {
    members: Member[];
}


/* =========================
   Members
========================= */

export const SearchFilterSchema = z.object({
    search: z.string().optional(),
    class: z.string().optional(),
    level: z.string().optional(),
    field: z.string().optional(),
    is_director: z.boolean().optional(),

    group_id: z
        .uuid("ID de grupo inválido.")
        .nullable()
        .optional(),
});

export type FindMembersFilter =
    z.infer<typeof SearchFilterSchema>;

export const MemberSchema = z.object({
    id: z.uuid("ID inválido ou obrigatório."),

    war_name: z.string(),

    full_name: z.string(),

    number: z
        .string()
        .regex(/^\d+$/, "Deve conter apenas números.")
        .min(4, "Mínimo de 4 dígitos."),

    class: z
        .string()
        .regex(/^\d+$/, "Deve conter apenas números.")
        .length(3, "A turma deve ter 3 dígitos."),

    phone: z
        .string()
        .optional(),

    level: levelSchema,
    field: fieldSchema,

    is_director: z
        .boolean()
        .default(false),

    group_id: z
        .uuid()
        .nullable(),

    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export const CreateMemberSchema =
    MemberSchema
        .omit({
            id: true,
            group_id: true,
            created_at: true,
            updated_at: true,
        });

export const UpdateMemberSchema =
    MemberSchema
        .omit({
            created_at: true,
        })
        .partial()
        .extend({
            id: z.uuid(
                "ID inválido ou obrigatório"
            ),
        });

export type Member =
    z.infer<typeof MemberSchema>;

export type CreateMemberDTO =
    z.infer<typeof CreateMemberSchema>;

export type UpdateMemberDTO =
    z.infer<typeof UpdateMemberSchema>;