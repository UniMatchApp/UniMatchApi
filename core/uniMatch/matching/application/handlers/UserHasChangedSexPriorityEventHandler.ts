import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";

export class UserHasChangedSexPriorityEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        const userId = event.getAggregateId();
        const sexPriority = event.getPayload().get("priority");

        if (!userId || !sexPriority) {
            throw new Error("User ID and sex priority are required to update a user's sex priority.");
        }

        const user = await this.repository.findByUserId(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.sexPriority = sexPriority;
        this.repository.save(user);
    }

    getEventId(): string {
        return "user-has-changed-priority";
    }
}
