import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Gender } from "@/core/shared/domain/Gender";
import { Profile } from "../Profile";

export class UserHasChangedPriority extends DomainEvent {
    constructor(aggregateId: string, priority: Gender | undefined) {
        super(aggregateId, "user-has-changed-priority");
        this.getPayload().set("priority", priority?.toString() ?? "");
    }

    public static from(profile: Profile): UserHasChangedPriority {
        return new UserHasChangedPriority(profile.userId, profile.genderPriority);
    }
}