export class FileError extends Error {
    constructor(resource: string);
    constructor(resource: string, cause: Error);
    constructor(resource: string, cause?: Error) {
        super(`${resource}`);
        this.name = "FileError";
        
        if (cause) {
            this.stack = cause.stack;
        }
        
        Object.setPrototypeOf(this, FileError.prototype);
    }
}
