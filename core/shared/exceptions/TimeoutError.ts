export class TimeoutError extends Error {
    constructor(message: string);
    constructor(message: string, cause: Error);
    constructor(message: string, cause?: Error) {
        super(message || 'Operation timed out');
        this.name = "TimeoutError";
        
        if (cause) {
            this.stack = cause.stack;
        }
        
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}
