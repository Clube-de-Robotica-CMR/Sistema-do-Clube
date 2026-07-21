import { AppError } from "./app-error";

export class AuthError extends AppError {
    constructor(msg: string) {
        super(msg, 200)
    }
}