import { CreateRefreshTokenDTO, RefreshToken } from "@/core/entities/refresh_token.entity";

export interface RefreshTokensRepository {
  save(token: CreateRefreshTokenDTO): Promise<void>;
  get_by_token(token: string): Promise<RefreshToken | null>;
  delete_by_token(token: string): Promise<void>;
  delete_by_user_id(userId: string): Promise<void>;
}