export class EventError extends Error {
    constructor(message: string);
    constructor(message: string, cause: Error);
    constructor(message: string, cause?: Error) {
        super(message);
        this.name = "EventError";
        
        if (cause) {
            this.stack = cause.stack;
        }
        
        Object.setPrototypeOf(this, EventError.prototype);
    }
}
