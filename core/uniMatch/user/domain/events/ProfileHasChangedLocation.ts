import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Profile } from "../Profile";
import { Location } from "@/core/shared/domain/Location";

export class ProfileHasChangedLocation extends DomainEvent {
    constructor(aggregateId: string, location: Location) {
        super(aggregateId, "profile-has-changed-location");
        this.getPayload().set("location", location.toString());
    }

    public static from(profile: Profile): ProfileHasChangedLocation {
        return new ProfileHasChangedLocation(profile.getId(), profile.location);
    }

    public getLocation(): Location {
        // Deserializa el objeto Location desde el string guardado en el payload
        const locationString = this.getPayload().get("location");
        if (!locationString) {
            throw new Error("Location string is undefined");
        }
        return new Location(0, 0).stringToLocation(locationString);
    }
}
