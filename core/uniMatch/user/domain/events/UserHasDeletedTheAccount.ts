import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { User } from "../User";

export class UserHasDeletedTheAccount extends DomainEvent {
    constructor(aggregateId: string) {
        super(aggregateId, "user-has-deleted-account");
    }

    public static from(user: User): UserHasDeletedTheAccount {
        return new UserHasDeletedTheAccount(user.getId().toString());
    }
}