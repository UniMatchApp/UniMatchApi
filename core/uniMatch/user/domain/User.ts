
import { AggregateRoot } from "../../../shared/domain/AggregateRoot ";
import { DomainError } from "../../../shared/domain/DomainError";

export class User extends AggregateRoot {
    private _code: string;
    private _registrationDate: Date;
    private _email: string;
    private _password: string;
    private _blockedUsers: string[] = [];

    constructor(
        code: string,
        registrationDate: Date,
        email: string,
        password: string,
        blockedUsers: string[] = []
    ) {
        super();
        this._code = code;
        this._registrationDate = registrationDate;
        this.email = email;
        this.password = password;
        this._blockedUsers = blockedUsers;
    }

    public get code(): string {
        return this._code;
    }

    public get registrationDate(): Date {
        return this._registrationDate;
    }

    public get email(): string {
        return this._email;
    }

    public set email(value: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            throw new DomainError("Invalid email format.");
        }
        this._email = value;
    }

    public get password(): string {
        return this._password;
    }

    public set password(value: string) {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const minLength = 8;

        if (value.length < minLength) {
            throw new DomainError(`Password must be at least ${minLength} characters long.`);
        }

        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            throw new DomainError(
                "Password must include uppercase, lowercase, a number, and a special character."
            );
        }

        this._password = value;
    }

    public get blockedUsers(): string[] {
        return this._blockedUsers;
    }

    public set blockedUsers(value: string[]) {
        this._blockedUsers = value;
    }

    public blockUser(userId: string): void {
        if (!this._blockedUsers.includes(userId)) {
            this._blockedUsers.push(userId);
        }
    }

    public unblockUser(userId: string): void {
        this._blockedUsers = this._blockedUsers.filter(
            (blockedUser) => blockedUser !== userId
        );
    }

    public isUserBlocked(userId: string): boolean {
        return this._blockedUsers.includes(userId);
    }
}
