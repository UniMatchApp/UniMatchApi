export class NotFoundError extends Error {
    constructor(resource: string);
    constructor(resource: string, cause: Error);
    constructor(resource: string, cause?: Error) {
        super(`${resource}`);
        this.name = "NotFoundError";
        
        if (cause) {
            this.stack = cause.stack;
        }
        
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
