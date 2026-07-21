import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import crypto from 'crypto';
import { api_handler } from '@/infra/adapters/input/api_handler';
import { create_router } from '@/infra/adapters/input/router';
import { LoginUserSchema } from '@/core/entities/user.entity';
import { auth_user } from '@/core/use-cases/auth_user';
import { DrizzleUsersRepository } from '@/infra/adapters/output/drizzle/users_repository';
import { DrizzleRefreshTokensRepository } from '@/infra/adapters/output/drizzle/refresh_token_repository';
import { BcryptHashService } from '@/infra/adapters/output/bcrypt/hash_service';
import {
    expireTimeAccessToken,
    expireTimeAccessTokenInSeconds,
    expireTimeRefreshTokenInDays,
    expireTimeRefreshTokenInSeconds
} from '@/core/entities/refresh_token.entity';
import 'dotenv/config';
import { AuthError } from '@/core/errors/auth-error';
import { get_data_from_request } from '@/infra/adapters/input/get_data';
import { require_login } from '@/infra/adapters/input/require_login';

const usersRepo = new DrizzleUsersRepository();
const refreshTokensRepo = new DrizzleRefreshTokensRepository();
const hashService = new BcryptHashService();

const router = create_router({
    'login': async (req, res) => {
        const data = get_data_from_request(req)

        const bodyValidados = LoginUserSchema.parse(data);

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
            name: 'access_token',
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

    'refresh': async (req, res) => {
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

        const user = await usersRepo.get_by_id(savedToken.user_id);

        if (!user) {
            throw new AuthError('Usuário não encontrado.');
        }

        const newAccessToken = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET as string,
            { expiresIn: expireTimeAccessToken }
        );

        const accessTokenCookie = cookie.stringifySetCookie({
            name: 'access_token',
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
    },

    "me": async (req, res) => {

        const user = require_login(req);

        return res.json({
            ok: true,
            data: user,
        });

    },

    "logout": async (req, res) => {
        const cookies = cookie.parseCookie(req.headers.cookie || "");
        const refreshToken = cookies["refresh_token"];

        if (refreshToken) {
            await refreshTokensRepo.delete_by_token(refreshToken);
        }

        const isProd = process.env.NODE_ENV === "production";

        const expiredAccessCookie = cookie.stringifySetCookie({
            name: "access_token",
            value: "",
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            path: "/",
            maxAge: 0,
        });

        const expiredRefreshCookie = cookie.stringifySetCookie({
            name: "refresh_token",
            value: "",
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            path: "/",
            maxAge: 0,
        });

        res.setHeader("Set-Cookie", [
            expiredAccessCookie,
            expiredRefreshCookie,
        ]);

        return res.status(200).json({
            ok: true,
            message: "Logout realizado com sucesso.",
        });
    },
});

export default api_handler(router);