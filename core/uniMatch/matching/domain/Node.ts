import { AggregateRoot } from "@/core/shared/domain/AggregateRoot ";
import { Like } from "./relations/Like";
import { Dislike } from "./relations/Dislike";
import { Gender } from "@/core/shared/domain/Gender";

export class Node extends AggregateRoot {
    private _age: number;
    private _location: string;
    private _maxDistance: number;
    private _gender: Gender;
    private _sexPriority: string;
    private _relationshipType: string;
    private _likes: Like[] = [];
    private _dislikes: Dislike[] = [];

    constructor(
        age: number,
        location: string,
        maxDistance: number,
        gender: Gender,
        sexPriority: string,
        relationshipType: string
    ) {
        super();
        this._age = age;
        this._location = location;
        this._maxDistance = maxDistance;
        this._gender = gender;
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

    public get gender(): Gender {
        return this._gender;
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

    public set gender(value: Gender) {
        this._gender = value;
    }

    public get likes(): Like[] {
        return this._likes;
    }

    public get dislikes(): Dislike[] {
        return this._dislikes;
    }

    public addLike(like: Like): void {
        this._likes.push(like);
    }

    public addDislike(dislike: Dislike): void {
        this._dislikes.push(dislike);
    }


    public removeLike(like: Like): void {
        this._likes = this._likes.filter((l) => l !== like);
    }

    public removeDislike(dislike: Dislike): void {
        this._dislikes = this._dislikes.filter((d) => d !== dislike);
    }
}
