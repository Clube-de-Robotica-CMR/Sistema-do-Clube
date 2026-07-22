import { ApiError } from "./api_error";

export function getErrorMessage(error: unknown): string {
    if (error instanceof ApiError)
        return error.message;

    return "Ocorreu um erro inesperado.";
}