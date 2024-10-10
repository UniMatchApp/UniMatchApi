import { DomainError } from "../../../shared/domain/DomainError";


export class SexualOrientation {
    private _value: string;
    private static readonly allowedOrientations = ["HETEROSEXUAL", "HOMOSEXUAL", "BISEXUAL", "ASEXUAL", "OTHER"];

    constructor(value: string) {
        this.setValue(value);
    }

    public get value(): string {
        return this._value;
    }

    public setValue(value: string): void {
        const uppercasedValue = value.toUpperCase();
        if (!SexualOrientation.allowedOrientations.includes(uppercasedValue)) {
            throw new DomainError(`Sexual orientation must be one of the following: ${SexualOrientation.allowedOrientations.join(", ")}.`);
        }
        this._value = uppercasedValue;
    }

    public toString(): string {
        return this._value;
    }
}
