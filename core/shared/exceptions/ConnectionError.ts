export class ConnectionError extends Error {
    constructor(service: string);
    constructor(service: string, cause: Error);
    constructor(service: string, cause?: Error) {
        super(`Failed to connect to ${service}`);
        this.name = "ConnectionError";
        
        if (cause) {
            this.stack = cause.stack;
        }
        
        Object.setPrototypeOf(this, ConnectionError.prototype);
    }
}
