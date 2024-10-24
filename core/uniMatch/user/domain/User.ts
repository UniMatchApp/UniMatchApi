import {AggregateRoot} from "@/core/shared/domain/AggregateRoot ";
import {DomainError} from "@/core/shared/exceptions/DomainError";
import {UserHasChangedEmail} from "./events/UserHasChangedEmail";
import {UserHasChangedPassword} from "./events/UserHasChangedPassword";
import {UserHasDeletedTheAccount} from "./events/UserHasDeletedTheAccount";
import {NewUser} from "./events/NewUser";
import { ReportedUser } from "./ReportedUser";

export class User extends AggregateRoot {
    private readonly _code: string;
    private readonly _registrationDate: Date;
    private _email: string;
    private _password: string;
    private _blockedUsers: string[] = [];
    private _reportedUsers: ReportedUser[] = [];
    private _registered: boolean;

    constructor(
        registrationDate: Date,
        email: string,
        password: string,
        blockedUsers: string[] = [],
        registered: boolean = false
    ) {
        super();
        this._code = Math.floor(100000 + Math.random() * 900000).toString();
        this._registrationDate = registrationDate;
        this._email = email;
        this._password = password;
        this._blockedUsers = blockedUsers;
        this._registered = registered;
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

    public get registered(): boolean {
        return this._registered;
    }

    public completeRegistration() : void {
        this._registered = true;
    }

    public set email(value: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            throw new DomainError("Invalid email format.");
        }
        this._email = value;

        this.recordEvent(new UserHasChangedEmail(this.getId().toString(), value));
    }

    public validatePassword(password: string): boolean {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const minLength = 8;

        if (password.length < minLength) {
            throw new DomainError(`Password must be at least ${minLength} characters long.`);
        }

        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            throw new DomainError(
                "Password must include uppercase, lowercase, a number, and a special character."
            );
        }

        return true;
    }

    public get password(): string {
        return this._password;
    }

    public set password(value: string) {
        this.validatePassword(value);

        this._password = value;

        this.recordEvent(new UserHasChangedPassword(this.getId().toString()));
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

    public set reportedUsers(value: ReportedUser[]) {
        this._reportedUsers = value;
    }
    
    public reportUser(reportedUser: ReportedUser): void {
        this._reportedUsers.push(reportedUser);

    }

    public getReportedUsers(): { userId: string, predefinedReason: string, comment?: string }[] {
        return this._reportedUsers;
    }
    
    public delete(): void {
        this.makeInactive();
        this.recordEvent(new UserHasDeletedTheAccount(this.getId().toString()));
    }

    public create(): void {
        this.recordEvent(NewUser.from(this));
    }
}
