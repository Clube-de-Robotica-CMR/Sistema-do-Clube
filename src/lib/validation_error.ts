export type FieldErrors = Record<string, string>;


export interface ValidationDetails {
    formErrors: string[];

    fieldErrors: FieldErrors;
}

export class ValidationError extends Error {
    constructor(
        message: string,
        public readonly details: ValidationDetails
    ) {
        super(message);

        this.name = "ValidationError";
    }
}