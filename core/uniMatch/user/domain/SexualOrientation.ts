import {DomainError} from "@/core/shared/exceptions/DomainError";

type AllowedOrientations = "HETEROSEXUAL" | "HOMOSEXUAL" | "BISEXUAL" | "ASEXUAL" | "OTHER";

export class SexualOrientation {
    private _value: AllowedOrientations;
    private static readonly allowedOrientations: AllowedOrientations[] = ["HETEROSEXUAL", "HOMOSEXUAL", "BISEXUAL", "ASEXUAL", "OTHER"];

    constructor(value: AllowedOrientations) {
        this._value = value;
    }

    public get value(): AllowedOrientations {
        return this._value;
    }

    public setValue(value: AllowedOrientations): void {
        const uppercasedValue = value.toUpperCase() as AllowedOrientations;
        if (!SexualOrientation.allowedOrientations.includes(uppercasedValue)) {
            throw new DomainError(`Sexual orientation must be one of the following: ${SexualOrientation.allowedOrientations.join(", ")}.`);
        }
        this._value = uppercasedValue;
    }

    public toString(): string {
        return this._value;
    }
}