import { CreateRefreshTokenDTO, RefreshToken } from "@/core/entities/refresh_token.entity";

export interface RefreshTokensRepository {
  save(token: CreateRefreshTokenDTO): Promise<undefined>;
  get_by_token(token: string): Promise<RefreshToken | undefined>;
  delete_by_token(token: string): Promise<undefined>;
  delete_by_user_id(userId: string): Promise<undefined>;
}