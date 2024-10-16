import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Profile } from "../Profile";

export class UserHasChangedDistance extends DomainEvent {
    constructor(aggregateId: string, distance: number) {
        super(aggregateId, "user-has-changed-distance");
        this.getPayload().set("distance", distance.toString());
    }

    public static from(profile: Profile): UserHasChangedDistance {
        return new UserHasChangedDistance(profile.getId(), profile.maxDistance);
    }
}