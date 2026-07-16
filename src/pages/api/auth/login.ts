import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import crypto from 'crypto'; 
import { create_router } from '@/infra/adapters/input/router';
import { LoginUserSchema } from '@/core/entities/user.entity';
import { auth_user } from '@/core/use-cases/auth_user';
import { api_handler } from '@/infra/adapters/input/api-handler';
import { DrizzleUsersRepository } from '@/infra/adapters/output/drizzle/users_repository';
import { DrizzleRefreshTokensRepository } from '@/infra/adapters/output/drizzle/refresh_token_repository';
import { BcryptHashService } from '@/infra/adapters/output/bcrypt/hash_service';
import { expireTimeAccessToken, expireTimeAccessTokenInSeconds, expireTimeRefreshTokenInDays, expireTimeRefreshTokenInSeconds } from '@/core/entities/refresh_token.entity';
import 'dotenv/config'

const usersRepo = new DrizzleUsersRepository();
const refreshTokensRepo = new DrizzleRefreshTokensRepository();
const hashService = new BcryptHashService();

const router = create_router({
  POST: async (req, res) => {
    const bodyValidados = LoginUserSchema.parse(req.body);

    const user = await auth_user(bodyValidados, usersRepo, hashService);

    const accessToken = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: expireTimeAccessToken }
    );

    const rawRefreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expireTimeRefreshTokenInDays); 

    await refreshTokensRepo.save({
        token: rawRefreshToken,
        user_id: user.id,
        expires_at: expiresAt,
    });

    const isProd = process.env.NODE_ENV === 'production';

    const accessTokenCookie = cookie.stringifySetCookie({
      name: 'auth_token',
      value: accessToken,
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: expireTimeAccessTokenInSeconds,
      path: '/',
    });

    const refreshTokenCookie = cookie.stringifySetCookie({
      name: 'refresh_token',
      value: rawRefreshToken,
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: expireTimeRefreshTokenInSeconds,
      path: '/',
    });

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return res.status(200).json({
      ok: true,
      data: user,
    });
  },
});

export default api_handler(router);