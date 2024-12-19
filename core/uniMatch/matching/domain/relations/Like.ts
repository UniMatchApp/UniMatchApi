import { Node } from "../Node";

export class Like {
    private _fromProfile: Node;
    private _toProfile: Node;
    private _timestamp: Date;

    constructor(fromProfile: Node, toProfile: Node) {
        this._fromProfile = fromProfile;
        this._toProfile = toProfile;
        this._timestamp = new Date();
    }

    public get fromProfile(): Node {
        return this._fromProfile;
    }

    public get toProfile(): Node {
        return this._toProfile;
    }

    public get timestamp(): Date {
        return this._timestamp;
    }

    public set fromProfile(value: Node) {
        this._fromProfile = value;
    }

    public set toProfile(value: Node) {
        this._toProfile = value;
    }

    public set timestamp(value: Date) {
        this._timestamp = value;
    }
}