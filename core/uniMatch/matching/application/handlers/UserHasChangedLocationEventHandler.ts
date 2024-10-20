import {IEventHandler} from "@/core/shared/application/IEventHandler";
import {DomainEvent} from "@/core/shared/domain/DomainEvent";
import {IMatchingRepository} from "../ports/IMatchingRepository";
import {Location} from "@/core/shared/domain/Location";

export class UserHasChangedLocationEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        const userId = event.getAggregateId();
        const stringLocation = event.getPayload().get("location");

        if (!userId || !stringLocation) {
            throw new Error("User ID and location are required to update a user's location.");
        }

        const user = await this.repository.findByUserId(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.location = Location.stringToLocation(stringLocation);
        await this.repository.save(user);
    }

    getEventId(): string {
        return "user-has-changed-location";
    }
}
