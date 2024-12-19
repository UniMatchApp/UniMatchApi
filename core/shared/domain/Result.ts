export class Result<T> {
    private readonly value: T | null;
    private readonly success: boolean;
    private readonly error: Error | null;

    private constructor(value: T | null, success: boolean, error: Error | null) {
        this.value = value;
        this.success = success;
        this.error = error;
    }

    public static success<T>(value: T): Result<T> {
        return new Result<T>(value, true, null);
    }

    public static failure<T>(error: Error): Result<T> {
        return new Result<T>(null, false, error);
    }

    public getValue(): T | null {
        return this.value;
    }

    public isSuccess(): boolean {
        return this.success;
    }

    public getError(): Error | null {
        return this.error;
    }

    public getErrorMessage(): string | null {
        return this.error ? this.error.message : null;
    }
}
