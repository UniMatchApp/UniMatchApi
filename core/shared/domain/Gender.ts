import {DomainError} from "@/core/shared/exceptions/DomainError";

type AllowedGenders = "MALE" | "FEMALE" | "OTHER"

export class Gender {
    private _value: string;
    private static readonly allowedGenders = ["MALE", "FEMALE", "OTHER"];

    constructor(value: AllowedGenders) {
        this._value = value;
    }

    public get value(): string {
        return this._value;
    }

    public setValue(value: AllowedGenders): void {
        const uppercasedValue = value.toUpperCase();
        if (!Gender.allowedGenders.includes(uppercasedValue)) {
            throw new DomainError(`Gender must be one of the following: ${Gender.allowedGenders.join(", ")}.`);
        }
        this._value = uppercasedValue;
    }

    public toString(): string {
        return this._value;
    }

    public static fromString(value: string): Gender {
        const uppercasedValue = value.toUpperCase();
        if (!Gender.allowedGenders.includes(uppercasedValue)) {
            throw new DomainError(`Gender must be one of the following: ${Gender.allowedGenders.join(", ")}.`);
        }
        return new Gender(uppercasedValue as AllowedGenders);
    }
}
