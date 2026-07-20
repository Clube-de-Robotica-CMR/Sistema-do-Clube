import { NextApiRequest, NextApiResponse } from "next";
import { AuthError } from "@/core/errors/auth-error";
import { get_auth_user } from "./get_auth_user";

export function require_admin(req: NextApiRequest, res: NextApiResponse) {
  const payload = get_auth_user(req)
  if (payload.role !== "admin") {
    throw new AuthError("O usuário não tem permissão para acessar esse recurso.")
  }
}