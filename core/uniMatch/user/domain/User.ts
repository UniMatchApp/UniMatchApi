
import { AggregateRoot } from "@/core/shared/domain/AggregateRoot ";
import { DomainError } from "@/core/shared/domain/DomainError";
import { UserHasChangedEmail } from "./events/UserHasChangedEmail";
import { UserHasChangedPassword } from "./events/UserHasChangedPassword";
import { Profile } from "./Profile";
import { UserHasDeletedTheAccount } from "./events/UserHasDeletedTheAccount";
import { NewUser } from "./events/NewUser";

export class User extends AggregateRoot {
    private readonly _code: string;
    private readonly _registrationDate: Date;
    private _email: string;
    private _password: string;
    private _blockedUsers: string[] = [];
    private _profile?: Profile

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
        this._email = email;
        this._password = password;
        this._blockedUsers = blockedUsers;

        this.recordEvent(new NewUser(this.getId().toString(), email));
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

        this.recordEvent(new UserHasChangedEmail(this.getId().toString(), value));
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

        this.recordEvent(new UserHasChangedPassword(this.getId().toString()));
    }

    public get blockedUsers(): string[] {
        return this._blockedUsers;
    }

    public set blockedUsers(value: string[]) {
        this._blockedUsers = value;
    }

    public get profile(): Profile | undefined {
        return this._profile;
    }

    public set profile(value: Profile | undefined) {
        this._profile = value;
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

    public delete(): void {
        this.makeInactive();
        this.recordEvent(new UserHasDeletedTheAccount(this.getId().toString()));
    }
}
