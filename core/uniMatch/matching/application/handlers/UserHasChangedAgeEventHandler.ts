import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { EventError } from "@/core/shared/exceptions/EventError";

export class UserHasChangedAgeEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const eventPayload = event.getEventId()
            const userId = event.getAggregateId();
            const age = event.getPayload().get("age");
            
            if (!userId || !age) {
                throw new EventError("User ID and Age is required to update a user's age.");
            }
         
            const user = await this.repository.findByUserId(userId);

            if (!user) {
                throw new EventError("User not found");
            }
    
            user.age = Number(age);
            await this.repository.update(user, user.getId());
        } catch (error : any) {
            console.error(error);
        }
    }

    getEventId(): string {
        return "user-has-changed-age";
    }
}