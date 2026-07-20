import { NextApiRequest } from "next";
import { get_auth_user } from "./get_auth_user";

export function require_login(req: NextApiRequest) {
  return get_auth_user(req);
}