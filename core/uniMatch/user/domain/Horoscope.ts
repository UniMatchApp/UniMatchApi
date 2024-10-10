import { DomainError } from "../../../shared/domain/DomainError";


export class Horoscope {
    private _value: string;
    private static readonly allowedHoroscopes = [
        "ARIES", "TAURUS", "GEMINI", "CANCER", "LEO", "VIRGO",
        "LIBRA", "SCORPIO", "SAGITTARIUS", "CAPRICORN", "AQUARIUS", "PISCES"
    ];

    constructor(value: string) {
        this.setValue(value);
    }

    public get value(): string {
        return this._value;
    }

    public setValue(value: string): void {
        const uppercasedValue = value.toUpperCase();
        if (!Horoscope.allowedHoroscopes.includes(uppercasedValue)) {
            throw new DomainError(`Horoscope must be one of the following: ${Horoscope.allowedHoroscopes.join(", ")}.`);
        }
        this._value = uppercasedValue;
    }

    public toString(): string {
        return this._value;
    }
}
