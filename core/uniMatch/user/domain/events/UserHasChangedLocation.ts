import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Profile } from "../Profile";
import { Location } from "@/core/shared/domain/Location";

export class UserHasChangedLocation extends DomainEvent {
    constructor(aggregateId: string, location: Location) {
        super(aggregateId, "user-has-changed-location");
        this.getPayload().set("location", location.toString());
    }

    public static from(profile: Profile): UserHasChangedLocation {
        return new UserHasChangedLocation(profile.getId(), profile.location);
    }
}
