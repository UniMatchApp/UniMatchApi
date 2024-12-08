import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { EventError } from "@/core/shared/exceptions/EventError";

export class UserHasDeletedAccountHandler implements IEventHandler {

    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const userId = event.getAggregateId();
    
            if (!userId ) {
                throw new EventError("User ID is required to delete a user");
            }
    
            await this.repository.deleteByUserId(userId);

        } catch (error : any) {
            console.error(error);
        }
    }

    getEventId(): string {
        return "user-has-deleted-account";
    }
}
