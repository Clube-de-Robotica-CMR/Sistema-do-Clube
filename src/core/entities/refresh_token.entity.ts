import z from "zod";

export const RefreshTokenSchema = z.object({
    id: z.uuid(),
    token: z.string(),
    user_id: z.uuid(),
    expires_at: z.coerce.date(),
    created_at: z.coerce.date(),
})

export const CreateRefreshTokenSchema = RefreshTokenSchema.pick({
    token: true,
    user_id: true,
    expires_at: true,
})

export type RefreshToken = z.infer<typeof RefreshTokenSchema>
export type CreateRefreshTokenDTO = z.infer<typeof CreateRefreshTokenSchema>


export const expireTimeAccessToken = '15m'
export const expireTimeRefreshTokenInDays = 10
export const expireTimeAccessTokenInSeconds = 15 * 60
export const expireTimeRefreshTokenInSeconds = expireTimeRefreshTokenInDays * 24 * 60 * 60