import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { EventError } from "@/core/shared/exceptions/EventError";
import { Gender } from "@/core/shared/domain/Gender";

export class UserHasChangedSexPriorityEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const userId = event.getAggregateId();
            const genderPriority = event.getPayload().get("priority");

            if (!userId || !genderPriority) {
                throw new EventError("User ID and gender priority are required to update a user's sex priority.");
            }
    
            const user = await this.repository.findByUserId(userId);
            if (!user) {
                throw new EventError("User not found");
            }
    
            user.genderPriority = new Gender(Gender.fromString(genderPriority));
            await this.repository.update(user, user.getId());
        } catch (error : any) {
            console.error(error);
        }
    }

    getEventId(): string {
        return "user-has-changed-priority";
    }
}
