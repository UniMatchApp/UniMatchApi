import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { User } from "../User";

export class UserHasDeletedTheAccount extends DomainEvent {
    constructor(aggregateId: string) {
        super(aggregateId, "user-has-deleted-the-account");
    }

    public static from(user: User): UserHasDeletedTheAccount {
        return new UserHasDeletedTheAccount(user.getId().toString());
    }
}