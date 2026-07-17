import { RequestError } from "@/core/errors/domain-errors";
import { NextApiRequest } from "next";

export function get_data_from_request(req: NextApiRequest)
{
    const { data } = req.body
    if (!data) throw new RequestError("O campo \"data\" é obrigatório no corpo da requisição para essa ação.")
    return data
}