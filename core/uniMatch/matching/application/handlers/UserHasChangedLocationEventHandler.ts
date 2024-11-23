import { IEventHandler } from "@/core/shared/application/IEventHandler";
import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { IMatchingRepository } from "../ports/IMatchingRepository";
import { Location } from "@/core/shared/domain/Location";
import { EventError } from "@/core/shared/exceptions/EventError";

export class UserHasChangedLocationEventHandler implements IEventHandler {
    private readonly repository: IMatchingRepository;

    constructor(repository: IMatchingRepository) {
        this.repository = repository;
    }

    async handle(event: DomainEvent): Promise<void> {
        try {
            const userId = event.getAggregateId();
            const stringLocation = event.getPayload().get("location");
    
            if (!userId) {
                throw new EventError("User ID and location are required to update a user's location.");
            }
    
            const user = await this.repository.findByUserId(userId);
            if (!user) {
                throw new EventError("User not found");
            }
    
            const location = stringLocation ? Location.stringToLocation(stringLocation) : undefined;
            user.location = location;
            this.repository.update(user, user.getId());
        } catch (error : any) {
            console.error(error);
        }
    }

    getEventId(): string {
        return "user-has-changed-location";
    }
}
