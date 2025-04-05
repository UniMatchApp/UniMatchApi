import { AggregateRoot } from "@/core/shared/domain/AggregateRoot ";

export class ReportedUser extends AggregateRoot {
    private readonly _userId: string;
    private _predefinedReason: string;
    private _comment?: string;
    private _details: string;
    private _timestamp: string;

    constructor(userId: string, predefinedReason: string, details: string, comment?: string, timestamp: string = new Date().toISOString()) {
        super();
        this._userId = userId;
        this._predefinedReason = predefinedReason;
        this._comment = comment;
        this._details = details;
        this._timestamp = timestamp;
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

    public get details(): string {
        return this._details;
    }

    public get timestamp(): string {
        return this._timestamp;
    }
    
    public set predefinedReason(value: string) {
        this._predefinedReason = value;
    }

    public set comment(value: string | undefined) {
        this._comment = value;
    }

    public set details(value: string) {
        this._details = value;
    }
}