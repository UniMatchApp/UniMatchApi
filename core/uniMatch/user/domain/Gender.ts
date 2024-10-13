import { DomainError } from "@/core/shared/domain/DomainError";

export class Gender {
    private _value: string;
    private static readonly allowedGenders = ["MALE", "FEMALE", "NON-BINARY", "OTHER"];

    constructor(value: string) {
        this._value = value;
    }

    public get value(): string {
        return this._value;
    }

    public setValue(value: string): void {
        const uppercasedValue = value.toUpperCase();
        if (!Gender.allowedGenders.includes(uppercasedValue)) {
            throw new DomainError(`Gender must be one of the following: ${Gender.allowedGenders.join(", ")}.`);
        }
        this._value = uppercasedValue;
    }

    public toString(): string {
        return this._value;
    }
}
