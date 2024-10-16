import { DomainError } from "@/core/shared/domain/DomainError";
import { Entity } from "@/core/shared/domain/Entity";

class Profile extends Entity {
    
    private _name: string;
    private _email: string;
    private _preferredImageURL: string;

    constructor(
        name: string,
        email: string,
        preferredImageURL: string
    ) {
        super();
        this._name = name;
        this._email = email;
        this._preferredImageURL = preferredImageURL;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        if (value.length === 0) {
            throw new DomainError("Name cannot be empty.");
        }
        this._name = value;
    }

    public get email(): string {
        return this._email;
    }

    public set email(value: string) {
        if (value.length === 0) {
            throw new DomainError("Email cannot be empty.");
        }
        this._email = value;
    }

    public get preferredImageURL(): string {
        return this._preferredImageURL;
    }

    public set preferredImageURL(value: string) {
        if (value.length === 0) {
            throw new DomainError("Preferred image URL cannot be empty.");
        }
        this._preferredImageURL = value;
    }
    
}