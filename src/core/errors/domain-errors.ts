import { AppError } from "./app-error";

export class NotFoundError extends AppError
{
    constructor(msg: string)
    {
        super(msg, 404)
    }
}