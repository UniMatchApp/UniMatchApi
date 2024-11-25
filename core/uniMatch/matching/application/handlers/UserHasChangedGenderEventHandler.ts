import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { EventError } from "@/core/shared/exceptions/EventError";
import { Gender } from "@/core/shared/domain/Gender";

export class UserHasChangedGenderEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            
            const userId = event.getAggregateId();
            const gender = event.getPayload().get("gender");
            
            if (!userId || !gender) {
                throw new EventError("User ID and Gender are required to update a user's gender.");
            }
            
            console.log("UserHasChangedGender event handled");
            const user = await this.repository.findByUserId(userId);

            if (!user) {
                throw new EventError("User not found");
            }
    
            user.gender = new Gender(Gender.fromString(gender));
            await this.repository.update(user, user.getId());
        } catch (error : any) {
            console.error(error);
        }
    }

    getEventId(): string {
        return "user-has-changed-gender";
    }
}