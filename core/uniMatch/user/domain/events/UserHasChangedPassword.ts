import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { User } from "../User";

export class UserHasChangedPassword extends DomainEvent {
    constructor(aggregateId: string) {
        super(aggregateId, "user-has-changed-password");
    }

    public static from(user: User): UserHasChangedPassword {
        return new UserHasChangedPassword(user.getId().toString());
    }
}