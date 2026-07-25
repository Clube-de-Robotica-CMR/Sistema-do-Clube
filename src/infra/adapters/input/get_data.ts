import { AppError } from "@/core/errors/app-error";
import { RequestError } from "@/core/errors/domain-errors";
import { NextApiRequest } from "next";

export function get_data_from_request(req: NextApiRequest) {
    const { data } = req.body
    if (!data) throw new AppError("O campo 'data' é obrigatório no corpo da requisição para essa ação.", 400)
    return data
}