import { Entity } from "@/core/shared/domain/Entity";

export class ReportedUser extends Entity {
    private _userId: string;
    private _predefinedReason: string;
    private _comment?: string;

    constructor(userId: string, predefinedReason: string, comment?: string) {
        super();
        this._userId = userId;
        this._predefinedReason = predefinedReason;
        this._comment = comment;
    }

    public get userId(): string {
        return this._userId;
    }

    public get predefinedReason(): string {
        return this._predefinedReason;
    }

    public get comment(): string | undefined {
        return this._comment;
    }
    
    public set predefinedReason(value: string) {
        this._predefinedReason = value;
    }

    public set comment(value: string | undefined) {
        this._comment = value;
    }



}