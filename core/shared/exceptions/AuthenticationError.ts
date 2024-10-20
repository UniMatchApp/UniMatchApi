export class AuthenticationError extends Error {
    constructor(message: string);
    constructor(message: string, cause: Error);
    constructor(message: string, cause?: Error) {
        super(message);
        this.name = "AuthenticationError";
        
        if (cause) {
            this.stack = cause.stack;
        }
        
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}
