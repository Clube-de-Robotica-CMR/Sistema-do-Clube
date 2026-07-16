import { CreateRefreshTokenDTO, RefreshToken } from "@/core/entities/refresh_token.entity";
import { DBError } from "@/core/errors/db-error";
import { RefreshTokensRepository } from "@/core/ports/auth/refresh_tokens_repository";
import { db } from "@/infra/db/drizzle/client";
import { refresh_tokens_table } from "@/infra/db/schemas/refresh_tokens.schema";
import { eq } from "drizzle-orm";

export class DrizzleRefreshTokensRepository implements RefreshTokensRepository {
  async save(token: CreateRefreshTokenDTO): Promise<undefined> {
    const result = await db
        .insert(refresh_tokens_table)
        .values(token)
        .returning();

    if (!result[0]) throw new DBError("Erro na criação de refresh token")
  }

  async get_by_token(token: string): Promise<RefreshToken | undefined> {
    const result = await db
      .select()
      .from(refresh_tokens_table)
      .where(eq(refresh_tokens_table.token, token))
      .limit(1);

    if (!result[0]) return undefined;

    return result[0];
  }

  async delete_by_token(token: string): Promise<undefined> {
    const result = await db
        .delete(refresh_tokens_table)
        .where(eq(refresh_tokens_table.token, token))
        .returning();

    if (!result[0]) throw new DBError("Erro ao tentar deletar o refresh token")
  }

  async delete_by_user_id(userId: string): Promise<undefined> {
    const result = await db
        .delete(refresh_tokens_table)
        .where(eq(refresh_tokens_table.user_id, userId))
        .returning();

    if (!result[0]) throw new DBError("Erro ao tentar deletar o refresh token")
  }
}