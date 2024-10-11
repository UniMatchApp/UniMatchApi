import { DomainError } from "../../../shared/domain/DomainError";
import { Entity } from "../../../shared/domain/Entity";

class Event extends Entity {
    private _title: string;
    private _participants: string[];

    constructor(
        title: string,
        participants: string[]
    ) {
        super();
        this._title = title;
        this._participants = participants;
    }

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        if (value.length === 0) {
            throw new DomainError("Title cannot be empty.");
        }
        this._title = value;
    }

    public get participants(): string[] {
        return this._participants;
    }

    public set participants(value: string[]) {
        if (value.length === 0) {
            throw new DomainError("Participants cannot be empty.");
        }
        this._participants = value;
    }
}