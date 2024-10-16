import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Profile } from "../Profile";

export class NewLike extends DomainEvent {
    constructor(aggregateId: string, user: string, target: string) {
        super(aggregateId, "new-like");
        this.getPayload().set("user", user);
        this.getPayload().set("target", target);
    }

    public static from(aggregateId: string, user: Profile, target: Profile): NewLike {
        return new NewLike(
            aggregateId,
            user.getId().toString(),
            target.getId().toString()
        );
    }
}
