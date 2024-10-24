import { AggregateRoot } from "@/core/shared/domain/AggregateRoot ";
import { Like } from "./relations/Like";
import { Dislike } from "./relations/Dislike";
import { Gender } from "@/core/shared/domain/Gender";
import { Location } from "@/core/shared/domain/Location";
import { RelationshipType } from "@/core/shared/domain/RelationshipType";

export class Node extends AggregateRoot {
    private _age: number;
    private _userId: string;
    private _location: Location;
    private _maxDistance: number;
    private _gender: Gender;
    private _genderPriority?: Gender;
    private _relationshipType: RelationshipType;

    constructor(
        userId: string,
        age: number,
        location: Location,
        maxDistance: number,
        gender: Gender,
        relationshipType: RelationshipType,
        genderPriority?: Gender,
    ) {
        super();
        this._userId = userId;
        this._age = age;
        this._location = location;
        this._maxDistance = maxDistance;
        this._gender = gender;
        this._genderPriority = genderPriority;
        this._relationshipType = relationshipType;
    }

    public get userId(): string {
        return this._userId;
    }

    public get age(): number {
        return this._age;
    }

    public get location(): Location {
        return this._location;
    }

    public get maxDistance(): number {
        return this._maxDistance;
    }

    public get genderPriority(): Gender | undefined {
        return this._genderPriority;
    }

    public get relationshipType(): RelationshipType {
        return this._relationshipType;
    }

    public get gender(): Gender {
        return this._gender;
    }

    public set userId(value: string) {
        this._userId = value;
    }

    public set age(value: number) {
        this._age = value;
    }

    public set location(value: Location) {
        this._location = value;
    }

    public set maxDistance(value: number) {
        this._maxDistance = value;
    }

    public set genderPriority(value: Gender | undefined) {
        this._genderPriority = value;
    }

    public set relationshipType(value: RelationshipType) {
        this._relationshipType = value;
    }

    public set gender(value: Gender) {
        this._gender = value;
    }

}
