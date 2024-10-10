import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { User } from "../User";

export class NewUser extends DomainEvent {
    constructor(aggregateId: string, email: string) {
        super(aggregateId, "new-user");
        this.getPayload().set("email", email);
    }

    public static from(user: User): NewUser {
        return new NewUser(
            user.getId().toString(),
            user.email
        );
    }
}
