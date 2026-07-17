import { AppError } from "./app-error";

export class NotFoundError extends AppError
{
    constructor(msg: string)
    {
        super(msg, 404)
    }
}

export class RequestError extends AppError
{
    constructor(msg: string)
    {
        super(msg, 400)
    }
}