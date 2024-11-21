import {AggregateRoot} from "@/core/shared/domain/AggregateRoot ";
import {DomainError} from "@/core/shared/exceptions/DomainError";
import {UserHasChangedEmail} from "./events/UserHasChangedEmail";
import {UserHasChangedPassword} from "./events/UserHasChangedPassword";
import {UserHasDeletedTheAccount} from "./events/UserHasDeletedTheAccount";
import {NewUser} from "./events/NewUser";
import { ReportedUser } from "./ReportedUser";
import { OTPManager } from "./OTPManager";

export class User extends AggregateRoot {
    private _privateKey: string;
    private readonly _registrationDate: Date;
    private _email: string = "";
    private _password: string = "";
    private _blockedUsers: string[] = [];
    private _reportedUsers: ReportedUser[] = [];
    private _registered: boolean;

    constructor(
        email: string,
        password: string,
        blockedUsers: string[] = [],
        registered: boolean = false
    ) {
        super();
        this._privateKey = OTPManager.generateSecret();
        this._registrationDate = new Date();
        this.email = email;
        this.password = password;
        this._blockedUsers = blockedUsers;
        this._registered = registered;
    }

    public get privateKey(): string {
        return this._privateKey;
    }
    
    public regeneratePrivateKey(): void {
        this._privateKey = OTPManager.generateSecret();
    }

    public set privateKey(value: string) {
        this._privateKey = value;
    }
    
    public generateVerificationCode(): string {
        return OTPManager.generateCode(this._privateKey);
    }
    
    public validateVerificationCode(code: string): boolean {
        return OTPManager.validateCode(code, this._privateKey);
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

    public set registered(value: boolean) {
        this._registered = value;
    }

    public completeRegistration() : void {
        this._registered = true;
    }

    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new DomainError("Invalid email format.");
        }
        return true;
    }

    public set email(value: string) {
        this.validateEmail(value);
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

    public get reportedUsers(): ReportedUser[] {
        return this._reportedUsers;
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
