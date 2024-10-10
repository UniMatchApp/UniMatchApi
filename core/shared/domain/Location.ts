import { DomainError } from "./DomainError";

export class Location {
    private _latitude: number;
    private _longitude: number;
    private _altitude?: number;

    constructor(latitude: number, longitude: number, altitude?: number) {
        this.setLatitude(latitude);
        this.setLongitude(longitude);
        if (altitude !== undefined) {
            this.setAltitude(altitude);
        }
    }

    public get latitude(): number {
        return this._latitude;
    }

    public setLatitude(value: number): void {
        if (value < -90 || value > 90) {
            throw new DomainError('Latitude must be between -90 and 90 degrees.');
        }
        this._latitude = value;
    }

    public get longitude(): number {
        return this._longitude;
    }

    public setLongitude(value: number): void {
        if (value < -180 || value > 180) {
            throw new DomainError('Longitude must be between -180 and 180 degrees.');
        }
        this._longitude = value;
    }

    public get altitude(): number | undefined {
        return this._altitude;
    }

    public setAltitude(value: number): void {
        this._altitude = value;
    }

    public toString(): string {
        return `Lat: ${this._latitude}, Lon: ${this._longitude}, Alt: ${this._altitude ?? 'N/A'}`;
    }
}
