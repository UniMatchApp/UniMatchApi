import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Profile } from "../Profile";

export class NewDislike extends DomainEvent {
    constructor(aggregateId: string, user: string, target: string) {
        super(aggregateId, "new-dislike");
        this.getPayload().set("user", user);
        this.getPayload().set("target", target);
    }

    public static from(aggregateId: string, user: Profile, target: Profile): NewDislike {
        return new NewDislike(
            aggregateId,
            user.getId().toString(),
            target.getId().toString()
        );
    }
}
