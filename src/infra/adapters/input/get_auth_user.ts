import { NextApiRequest } from "next";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";

import { AuthError } from "@/core/errors/auth-error";

export interface AuthenticatedUser {
    id: string;
    name: string;
    role: "admin" | "diretoria";
}

export function get_auth_user(
    req: NextApiRequest
): AuthenticatedUser {

    const cookies = cookie.parseCookie(req.headers.cookie || "");
    const token = cookies["access_token"];

    if (!token) {
        throw new AuthError("Acesso negado. Faça login.");
    }

    try {
        return jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as AuthenticatedUser;

    } catch {

        throw new AuthError("Sessão inválida ou expirada.");

    }
}