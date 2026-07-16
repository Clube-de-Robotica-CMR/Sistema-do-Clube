export class AppError extends Error 
{
    status: number

    constructor(msg: string, statuscode: number)
    {
        super(msg)
        this.status = statuscode
    }
}