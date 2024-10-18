import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";

export class UserHasChangedTypeOfRelationshipEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    handle(event: DomainEvent): void {
        const userId = event.getAggregateId();
        const relationshipType = event.getPayload().get("relationshipType");

        if (!userId || !relationshipType) {
            throw new Error("User ID and relationship type are required to update a user's relationship type.");
        }

        const user = this.repository.findByUserId(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.relationshipType = relationshipType;
        this.repository.save(user);
    }

    getEventId(): string {
        return "user-has-changed-type-of-relationship";
    }
}
