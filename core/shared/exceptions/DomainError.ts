export class DomainError extends Error {
    constructor(message: string);
    constructor(message: string, cause: Error);
    constructor(message: string, cause?: Error) {
        super(message);
        this.name = "DomainException";
        
        if (cause) {
            this.stack = cause.stack;
        }
        
        Object.setPrototypeOf(this, DomainError.prototype);
    }
}
