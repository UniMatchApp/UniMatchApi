import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { EventError } from "@/core/shared/exceptions/EventError";

export class UserHasChangedMaxDistanceEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const userId = event.getAggregateId();
            const maxDistance = event.getPayload().get("distance");
    
            if (!userId || !maxDistance) {
                throw new EventError("User ID and max distance are required to update a user's max distance.");
            }
    
            const user = await this.repository.findByUserId(userId);
            if (!user) {
                throw new EventError("User not found");
            }
    
            user.maxDistance = Number(maxDistance);
            this.repository.update(user, user.getId());
        } catch (error : any) {
            console.error(error);
        }
    }

    getEventId(): string {
        return "user-has-changed-max-distance";
    }
}
