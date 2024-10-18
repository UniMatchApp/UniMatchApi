import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";

export class UserHasChangedMaxDistanceEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    handle(event: DomainEvent): void {
        const userId = event.getAggregateId();
        const maxDistance = event.getPayload().get("distance");

        if (!userId || !maxDistance) {
            throw new Error("User ID and max distance are required to update a user's max distance.");
        }

        const user = this.repository.findByUserId(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.maxDistance = Number(maxDistance);
        this.repository.save(user);
    }

    getEventId(): string {
        return "user-has-changed-max-distance";
    }
}
