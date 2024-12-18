import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { EventError } from "@/core/shared/exceptions/EventError";
import { RelationshipType } from "@/core/shared/domain/RelationshipType";

export class UserHasChangedTypeOfRelationshipEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const userId = event.getAggregateId();
            const relationshipType = event.getPayload().get("relationshipType");
    
            if (!userId || !relationshipType) {
                throw new EventError("User ID and relationship type are required to update a user's relationship type.");
            }
    
            const user = await this.repository.findByUserId(userId);
            if (!user) {
                throw new EventError("User not found");
            }
    
            user.relationshipType = RelationshipType.fromString(relationshipType);
            await this.repository.update(user, user.getId());
        } catch (error : any) {
            console.error(error);
        }
    }

    getEventId(): string {
        return "user-has-changed-type-of-relationship";
    }
}
