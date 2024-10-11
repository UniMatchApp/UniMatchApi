import { DomainError } from "../../../shared/domain/DomainError";
import { Entity } from "../../../shared/domain/Entity";

class Profile extends Entity {
    
    private _name: string;
    private _email: string;
    private _preferedImageURL: string;

    constructor(
        name: string,
        email: string,
        preferedImageURL: string
    ) {
        super();
        this._name = name;
        this._email = email;
        this._preferedImageURL = preferedImageURL;
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

    public get preferedImageURL(): string {
        return this._preferedImageURL;
    }

    public set preferedImageURL(value: string) {
        if (value.length === 0) {
            throw new DomainError("Preferred image URL cannot be empty.");
        }
        this._preferedImageURL = value;
    }
    
}