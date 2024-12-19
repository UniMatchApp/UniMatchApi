import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { Node } from "../Node";

export class NewLike extends DomainEvent {
    constructor(aggregateId: string, user: string, target: string) {
        super(aggregateId, "new-like");
        this.getPayload().set("user", user);
        this.getPayload().set("target", target);
    }

    public static from(aggregateId: string, user: Node, target: Node): NewLike {
        return new NewLike(
            aggregateId,
            user.userId,
            target.userId
        );
    }
}
