import { Entity } from "../../../shared/domain/Entity";

export class Profile extends Entity {
    private _age: number;
    private _location: string;
    private _maxDistance: number;
    private _sexPriority: string;
    private _relationshipType: string;

    constructor(
        age: number,
        location: string,
        maxDistance: number,
        sexPriority: string,
        relationshipType: string
    ) {
        super();
        this._age = age;
        this._location = location;
        this._maxDistance = maxDistance;
        this._sexPriority = sexPriority;
        this._relationshipType = relationshipType;
    }

    public get age(): number {
        return this._age;
    }

    public get location(): string {
        return this._location;
    }

    public get maxDistance(): number {
        return this._maxDistance;
    }

    public get sexPriority(): string {
        return this._sexPriority;
    }

    public get relationshipType(): string {
        return this._relationshipType;
    }

    public set age(value: number) {
        this._age = value;
    }

    public set location(value: string) {
        this._location = value;
    }

    public set maxDistance(value: number) {
        this._maxDistance = value;
    }

    public set sexPriority(value: string) {
        this._sexPriority = value;
    }

    public set relationshipType(value: string) {
        this._relationshipType = value;
    }
}
