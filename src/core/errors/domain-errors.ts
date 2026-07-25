import { AppError } from "./app-error";

export class NotFoundError extends AppError {
    constructor(msg: string) {
        super(msg, 200)
    }
}

export class RequestError extends AppError {
    fieldErrors: Record<string, string[]>

    constructor(msg: string, fieldErrors: Record<string, string[]>) {
        super(msg, 200)
        this.fieldErrors = fieldErrors
    }
}

export class UnauthorizedError extends AppError {
    constructor(msg: string) {
        super(msg, 200)
    }
}