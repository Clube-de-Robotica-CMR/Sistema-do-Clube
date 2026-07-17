import { AuthError } from "@/core/errors/auth-error";
import { parseCookie } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"

export function require_login(req: NextApiRequest, res: NextApiResponse)
{
    const cookies = parseCookie(req.headers.cookie || '');
    const token = cookies['access_token'];
    
    if (!token) {
        throw new AuthError('Faça login para progredir.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      } catch (err) {
        throw new AuthError('Sessão inválida ou expirada.');
      }
}