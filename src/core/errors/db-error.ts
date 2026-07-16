import { AppError } from "./app-error";

export class DBError extends AppError
{
    constructor(msg: string)
    {
        super(msg, 500)
    }
}