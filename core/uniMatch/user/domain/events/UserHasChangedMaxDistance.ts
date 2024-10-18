import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Profile } from "../Profile";

export class UserHasChangedMaxDistance extends DomainEvent {
    constructor(aggregateId: string, distance: number) {
        super(aggregateId, "user-has-changed-max-distance");
        this.getPayload().set("distance", distance.toString());
    }

    public static from(profile: Profile): UserHasChangedMaxDistance {
        return new UserHasChangedMaxDistance(profile.getId(), profile.maxDistance);
    }
}