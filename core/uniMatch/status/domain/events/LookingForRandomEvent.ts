import { DomainEvent } from "@/core/shared/domain/DomainEvent";
import { ChatStatusEnum } from "../enum/ChatStatusEnum";

export class LookingForRandomEvent extends DomainEvent {
    constructor(
        userId: string,
        status: ChatStatusEnum
    ) {
        super(userId, "looking-for-random-event");
        const isLookingForRandom = status === ChatStatusEnum.FINDING_RANDOM;
        this.getPayload().set("isLookingForRandom", isLookingForRandom.toString());
    }

    public static from(userId: string, status: ChatStatusEnum): LookingForRandomEvent {
        return new LookingForRandomEvent(
            userId,
            status
        );
    }
}