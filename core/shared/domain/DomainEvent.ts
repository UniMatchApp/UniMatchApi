export class DomainEvent {
    private readonly eventId: string;
    private readonly aggregateId: string;
    private readonly occurredOn: string;
    private readonly payload: Map<string, string>;

    constructor(aggregateId: string, eventId: string) {
        this.aggregateId = aggregateId;
        this.eventId = eventId;
        this.payload = new Map<string, string>();
        this.occurredOn = new Date().toISOString().split('T')[0]; // LocalDate.now().toString() equivalente
    }

    public getAggregateId(): string {
        return this.aggregateId;
    }

    public getEventId(): string {
        return this.eventId;
    }

    public getOccurredOn(): string {
        return this.occurredOn;
    }

    public getPayload(): Map<string, string> {
        return this.payload;
    }
}
