import { AppError } from "./app-error";


export class RouterError extends AppError {
    constructor(msg: string) {
        super(msg, 200)
    }
}