import { AggregateRoot } from "../../../shared/domain/AggregateRoot ";
import { DomainError } from "../../../shared/domain/DomainError";
import { Gender } from "./Gender";
import { Horoscope } from "./Horoscope";
import { RelationshipType } from "./RelationshipType";
import { SexualOrientation } from "./SexualOrientation";

export class Profile extends AggregateRoot {
    private _userId: string;
    private _name: string;
    private _age: number;
    private _aboutMe: string;
    private _location: Location;
    private _fact?: string;
    private _interests: string[] = [];
    private _gender: Gender;
    private _height?: number;
    private _weight?: number;
    private _sexualOrientation: SexualOrientation;
    private _job?: string;
    private _relationshipType: RelationshipType;
    private _horoscope?: Horoscope;
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
    private _genderPriority?: Gender;

    constructor(
        userId: string,
        name: string,
        age: number,
        aboutMe: string,
        gender: Gender,
        location: Location,
        sexualOrientation: SexualOrientation,
        relationshipType: RelationshipType,
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

    public get gender(): Gender {
        return this._gender;
    }

    public set gender(value: Gender) {
        this._gender = value;
    }

    public get horoscope(): Horoscope | undefined {
        return this._horoscope;
    }

    public set horoscope(value: Horoscope | undefined) {
        this._horoscope = value;
    }

    public get relationshipType(): RelationshipType {
        return this._relationshipType;
    }

    public set relationshipType(value: RelationshipType) {
        this._relationshipType = value;
    }

    public get sexualOrientation(): SexualOrientation {
        return this._sexualOrientation;
    }

    public set sexualOrientation(value: SexualOrientation) {
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

    public set wall(value: string[]) {
        this._wall = value;
    }

    public get preferredImage(): string {
        return this._preferredImage;
    }

    public set preferredImage(value: string) {
        this._preferredImage = value;
    }

    public get aboutMe(): string {
        return this._aboutMe;
    }

    public set aboutMe(value: string) {
        this._aboutMe = value;
    }

    public get drinks(): string | undefined {
        return this._drinks;
    }

    public set drinks(value: string | undefined) {
        const drinksEnum = ["NEVER", "OCCASIONALLY", "OFTEN", "ALWAYS"];
        
        if (value && !drinksEnum.includes(value.toUpperCase())) {
            throw new DomainError("Invalid drinks value.");
        }
        
        this._drinks = value?.toUpperCase();
    }
    

    public get smokes(): string | undefined {
        return this._smokes;
    }

    public set smokes(value: string | undefined) {
        const smokesEnum = ["NEVER", "OCCASIONALLY", "OFTEN", "ALWAYS"];

        if (value && !smokesEnum.includes(value.toUpperCase())) {
            throw new DomainError("Invalid smokes value.");
        }

        this._smokes = value?.toUpperCase();
    }

    public get doesSports(): string | undefined {
        return this._doesSports;
    }

    public set doesSports(value: string | undefined) {
        const doesSportsEnum = ["NEVER", "OCCASIONALLY", "OFTEN", "ALWAYS"];

        if (value && !doesSportsEnum.includes(value.toUpperCase())) {
            throw new DomainError("Invalid doesSports value.");
        }

        this._doesSports = value?.toUpperCase();
    }

    public get valuesAndBeliefs(): string | undefined {
        return this._valuesAndBeliefs;
    }

    public set valuesAndBeliefs(value: string | undefined) {
        const valuesEnum = ["AGNOSTIC", "ATHEIST", "BUDDHIST", "CATHOLIC", "CHRISTIAN", "HINDU", "JEWISH", "MUSLIM", "PROTESTANT", "OTHER"];
        
        if (value && !valuesEnum.includes(value.toUpperCase())) {
            throw new DomainError("Invalid values and beliefs value.");
        }
    
        this._valuesAndBeliefs = value?.toUpperCase();
    }

    public get pets(): string | undefined {
        return this._pets;
    }

    public set pets(value: string | undefined) {
        this._pets = value;
    }

    public set birthday(value: Date) {
        this._birthday = value;
    }

    public get birthday(): Date {
        return this._birthday;
    }

    public set genderPriority(value: Gender | undefined) {
        this._genderPriority = value;
    }

    public get genderPriority(): Gender | undefined {
        return this._genderPriority;
    }

    public get fact(): string | undefined {
        return this._fact;
    }

    public set fact(value: string | undefined) {
        this._fact = value;
    }

    public get interests(): string[] {
        return this._interests;
    }

    public set interests(value: string[]) {
        this._interests = value;
    }

    public get height(): number | undefined {
        return this._height;
    }

    public set height(value: number | undefined) {
        if (value && (value < 120 || value > 240)) {
            throw new DomainError("Height must be between 120 and 240 cm.");
        }
        this._height = value;
    }

    public get weight(): number | undefined {
        return this._weight;
    }

    public set weight(value: number | undefined) {
        if (value && (value < 30 || value > 300)) {
            throw new DomainError("Weight must be between 30 and 300 kg.");
        }
        this._weight = value;
    }

    public get job(): string | undefined {
        return this._job;
    }

    public set job(value: string | undefined) {
        this._job = value;
    }

    public get education(): string | undefined {
        return this._education;
    }

    public set education(value: string | undefined) {
        this._education = value;
    }

    public get personalityType(): string | undefined {
        return this._personalityType;
    }

    public set personalityType(value: string | undefined) {
        this._personalityType = value;
    }
}
