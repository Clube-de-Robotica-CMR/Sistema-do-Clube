import z from "zod";

const RoleSchema = z.enum(["admin", "diretoria"])

export const UserSchema = z.object({
    id: z.uuid(),
    name: z.string().min(3, "O nome precisa ter, no mínimo, 3 letras"),
    password: z.string().min(8, "A senha deve ter, no mínimo, 8 caracteres"),
    role: RoleSchema,
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
})

export const CreateUserSchema = UserSchema.pick({
    name: true,
    password: true,
    role: true
})

export const LoginUserSchema = CreateUserSchema.omit({role: true})

export const UpdateUserSchema = UserSchema
    .omit({created_at: true})
    .partial()

export type Role = z.infer<typeof RoleSchema>
export type User = z.infer<typeof UserSchema>
export type CreateUserDTO = z.infer<typeof CreateUserSchema>
export type LoginUserDTO = z.infer<typeof LoginUserSchema>
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>