import { Profile } from "../Profile";

export class Dislike {
    private _fromProfile: Profile;
    private _toProfile: Profile;
    private _timestamp: Date;

    constructor(fromProfile: Profile, toProfile: Profile, timestamp: Date) {
        this._fromProfile = fromProfile;
        this._toProfile = toProfile;
        this._timestamp = timestamp;
    }

    public get fromProfile(): Profile {
        return this._fromProfile;
    }

    public get toProfile(): Profile {
        return this._toProfile;
    }

    public get timestamp(): Date {
        return this._timestamp;
    }

    public set fromProfile(value: Profile) {
        this._fromProfile = value;
    }

    public set toProfile(value: Profile) {
        this._toProfile = value;
    }

    public set timestamp(value: Date) {
        this._timestamp = value;
    }
}