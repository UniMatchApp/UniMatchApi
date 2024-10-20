import { Request, Response } from 'express';
import { IEventRepository } from '@/core/uniMatch/event/application/ports/IEventRepository';
import { Event } from '@/core/uniMatch/event/domain/Event';
import { IEventBus } from '@/core/shared/application/IEventBus';

export class EventController {
    private readonly eventRepository: IEventRepository;
    private readonly eventBus: IEventBus;

    constructor(eventRepository: IEventRepository, eventBus: IEventBus) {
        this.eventRepository = eventRepository;
        this.eventBus = eventBus;
    }

    async getAll(req: Request, res: Response): Promise<void> {
        const events = await this.eventRepository.findAll();
        res.json(events);
    }

}
