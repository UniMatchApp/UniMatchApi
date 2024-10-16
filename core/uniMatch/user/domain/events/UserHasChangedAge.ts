import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Profile } from "../Profile";

export class UserHasChangedAge extends DomainEvent {
    constructor(aggregateId: string, age: number) {
        super(aggregateId, "user-has-changed-age");
        this.getPayload().set("age", age.toString());
    }

    public static from(profile: Profile): UserHasChangedAge {
        return new UserHasChangedAge(profile.getId(), profile.age);
    }
}