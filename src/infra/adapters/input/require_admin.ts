import { NextApiRequest, NextApiResponse } from "next";
import * as cookie from "cookie"
import { AuthError } from "@/core/errors/auth-error";
import jwt from "jsonwebtoken"
import { AppError } from "@/core/errors/app-error";

export function require_admin(req: NextApiRequest, res: NextApiResponse) {
  const cookies = cookie.parseCookie(req.headers.cookie || '');
  const token = cookies['access_token'];

  if (!token) {
    throw new AuthError('Acesso negado. Faça login para continuar.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };
    
    if (decoded.role !== 'admin') {
      throw new AuthError('Acesso negado. Apenas administradores podem gerenciar usuários.');
    }
  } catch (err) {
    if (err instanceof AppError) throw err
    throw new AuthError('Sessão inválida ou expirada.');
  }
}