import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Profile } from "../Profile";

export class UserHasChangedAgeRange extends DomainEvent {
    constructor(aggregateId: string, ageRange: [number, number]) {
        super(aggregateId, "user-has-changed-ageRange");
        this.getPayload().set("ageRange", ageRange.toString());
    }

    public static from(profile: Profile): UserHasChangedAgeRange {
        return new UserHasChangedAgeRange(profile.userId, profile.ageRange);
    }
}