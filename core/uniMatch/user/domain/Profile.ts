
import { AggregateRoot } from "../../../shared/domain/AggregateRoot ";
import { DomainError } from "../../../shared/domain/DomainError";

export class Profile extends AggregateRoot {
    private _userId: string;
    private _name: string;
    private _age: number;
    private _aboutMe: string;
    private _location: Location;
    private _fact?: string;
    private _interests: string[] = [];
    private _gender: string;
    private _height?: number;
    private _weight?: number;
    private _sexualOrientation: string;
    private _job?: string;
    private _relationshipType: string;
    private _horoscope?: string;
    private _education?: string;
    private _personalityType?: string;
    private _pets?: string;
    private _drinks?: string;
    private _smokes?: string;
    private _doesSports?: string;
    private _valuesAndBeliefs?: string;
    private _wall: string[] = [];
    private _preferredImage: string;
    private _birthday: Date;
    private _maxDistance: number = 50; // Default value
    private _ageRange: [number, number] = [18, 100]; // Default value
    private _genderPriority?: string;

    constructor(
        userId: string,
        name: string,
        age: number,
        aboutMe: string,
        gender: string,
        location: Location,
        sexualOrientation: string,
        relationshipType: string,
        birthday: Date,
        interests: string[] = [],
        wall: string[]
    ) {
        super();
        this._userId = userId;
        this.name = name;
        this.age = age;
        this._aboutMe = aboutMe;
        this._location = location;
        this._gender = gender;
        this._sexualOrientation = sexualOrientation;
        this._relationshipType = relationshipType;
        this._preferredImage = this.wall[0];
        this._birthday = birthday;
        this._interests = interests;
        this._wall = wall;
    }

    public get userId(): string {
        return this._userId;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        if (value.trim().length === 0) {
            throw new DomainError("Name cannot be empty.");
        }
        this._name = value;
    }

    public get age(): number {
        return this._age;
    }

    public set age(value: number) {
        if (value < 18 || value > 100) {
            throw new DomainError("Age must be between 18 and 100.");
        }
        this._age = value;
    }

    public get location(): Location {
        return this._location;
    }

    public set location(value: Location) {
        this._location = value;
    }

    public get sexualOrientation(): string {
        return this._sexualOrientation;
    }

    public set sexualOrientation(value: string) {
        const validOrientations = ["Heterosexual", "Homosexual", "Bisexual", "Other"];
        if (!validOrientations.includes(value)) {
            throw new DomainError("Invalid sexual orientation.");
        }
        this._sexualOrientation = value;
    }

    public get maxDistance(): number {
        return this._maxDistance;
    }

    public set maxDistance(value: number) {
        if (value <= 0) {
            throw new DomainError("Max distance must be greater than 0.");
        }
        this._maxDistance = value;
    }

    public get ageRange(): [number, number] {
        return this._ageRange;
    }

    public set ageRange(value: [number, number]) {
        const [min, max] = value;
        if (min < 18 || max > 100 || min > max) {
            throw new DomainError("Age range must be valid and between 18 and 100.");
        }
        this._ageRange = value;
    }

    public get wall(): string[] {
        return this._wall;
    }
}