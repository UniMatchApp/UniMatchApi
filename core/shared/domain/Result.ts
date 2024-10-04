export class Result<T> {
    private readonly value: T | null;
    private readonly success: boolean;
    private readonly errorMessage: string | null;

    private constructor(value: T | null, success: boolean, errorMessage: string | null) {
        this.value = value;
        this.success = success;
        this.errorMessage = errorMessage;
    }

    public static success<T>(value: T): Result<T> {
        return new Result<T>(value, true, null);
    }

    public static failure<T>(errorMessage: string): Result<T> {
        return new Result<T>(null, false, errorMessage);
    }

    public getValue(): T | null {
        return this.value;
    }

    public isSuccess(): boolean {
        return this.success;
    }

    public getErrorMessage(): string | null {
        return this.errorMessage;
    }
}
