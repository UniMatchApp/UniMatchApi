export class ValidationError extends Error {
    constructor(message: string);
    constructor(message: string, cause: Error);
    constructor(message: string, cause?: Error) {
        super(message);
        this.name = "ValidationError";
        
        if (cause) {
            this.stack = cause.stack;
        }
        
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
