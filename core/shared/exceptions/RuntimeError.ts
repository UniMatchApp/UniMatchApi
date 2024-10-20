export class RuntimeError extends Error {
    constructor(message: string);
    constructor(message: string, cause: Error);
    constructor(message: string, cause?: Error) {
        super(message);
        this.name = "RuntimeError";
        
        if (cause) {
            this.stack = cause.stack;
        }
        
        Object.setPrototypeOf(this, RuntimeError.prototype);
    }
}
