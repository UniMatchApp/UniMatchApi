import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { User } from "../User";

export class UserHasChangedPassword extends DomainEvent {
    constructor(aggregateId: string, password: string) {
        super(aggregateId, "user-has-changed-password");
        this.getPayload().set("password", password);
    }

    public static from(user: User): UserHasChangedPassword {
        return new UserHasChangedPassword(user.getId().toString(), user.password);
    }
}