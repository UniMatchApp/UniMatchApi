export class NullPointerError extends Error {
    constructor(message: string);
    constructor(message: string, cause: Error);
    constructor(message: string, cause?: Error) {
        super(message || 'Null pointer exception');
        this.name = "NullPointerError";
        
        if (cause) {
            this.stack = cause.stack;
        }
        
        Object.setPrototypeOf(this, NullPointerError.prototype);
    }
}
