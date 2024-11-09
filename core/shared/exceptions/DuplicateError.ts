export class DuplicateError extends Error {
    constructor(resource: string);
    constructor(resource: string, cause: Error);
    constructor(resource: string, cause?: Error) {
        super(`${resource}`);
        this.name = "DuplicateError";
        
        if (cause) {
            this.stack = cause.stack;
        }
        
        Object.setPrototypeOf(this, DuplicateError.prototype);
    }
}
