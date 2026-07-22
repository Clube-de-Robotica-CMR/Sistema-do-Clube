export interface ValidationDetails {
    formErrors: string[];

    fieldErrors: Record<
        string,
        string[]
    >;
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