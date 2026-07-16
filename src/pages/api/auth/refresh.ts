import type { NextApiRequest, NextApiResponse } from 'next';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { api_handler } from '@/infra/adapters/input/api-handler';
import { create_router } from '@/infra/adapters/input/router';
import { DrizzleRefreshTokensRepository } from '@/infra/adapters/output/drizzle/refresh_token_repository';
import { DrizzleUsersRepository } from '@/infra/adapters/output/drizzle/users_repository';
import { AuthError } from '@supabase/supabase-js';
import { expireTimeAccessToken, expireTimeAccessTokenInSeconds } from '@/core/entities/refresh_token.entity';
import 'dotenv/config'

const refreshTokensRepo = new DrizzleRefreshTokensRepository();
const usersRepo = new DrizzleUsersRepository();

const router = create_router({
  POST: async (req, res) => {
    const cookies = cookie.parseCookie(req.headers.cookie || '');
    const originToken = cookies['refresh_token'];

    if (!originToken) {
      throw new AuthError('Sessão expirada. Faça login novamente.');
    }

    const savedToken = await refreshTokensRepo.get_by_token(originToken);
    if (!savedToken) {
      throw new AuthError('Token inválido ou revogado.');
    }

    if (new Date() > savedToken.expires_at) {
      await refreshTokensRepo.delete_by_token(originToken);
      throw new AuthError('Sessão expirada. Faça login novamente.');
    }

    const user = await usersRepo.get_by_id(savedToken.user_id)

    if (!user) {
      throw new AuthError('Usuário não encontrado.');
    }

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: expireTimeAccessToken }
    );

    const accessTokenCookie = cookie.stringifySetCookie({
      name: 'auth_token',
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expireTimeAccessTokenInSeconds,
      path: '/',
    });

    res.setHeader('Set-Cookie', accessTokenCookie);

    return res.status(200).json({
      ok: true,
      message: 'Token renovado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      }
    });
  }
});

export default api_handler(router);