import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { EventError } from "@/core/shared/exceptions/EventError";

export class UserHasChangedAgeRangeEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            
            const userId = event.getAggregateId();
            const ageRange = event.getPayload().get("ageRange");
            
            if (!userId || !ageRange) {
                throw new EventError("User ID and ageRange are required");
            }
            
            const user = await this.repository.findByUserId(userId);

            if (!user) {
                throw new EventError("User not found");
            }
            
            const parsedAgeRange = JSON.parse(ageRange) as [number, number];
            user.ageRange = parsedAgeRange;
            await this.repository.update(user, user.getId());
        } catch (error : any) {
            console.error(error);
        }
    }

    getEventId(): string {
        return "user-has-changed-ageRange";
    }
}