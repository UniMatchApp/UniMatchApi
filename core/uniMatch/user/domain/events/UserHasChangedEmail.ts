import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { User } from "../User";

export class UserHasChangedEmail extends DomainEvent {
    constructor(aggregateId: string, email: string) {
        super(aggregateId, "user-has-changed-email");
        this.getPayload().set("email", email);
    }

    public static from(user: User): UserHasChangedEmail {
        return new UserHasChangedEmail(user.getIsActive().toString(), user.email);
    }
}