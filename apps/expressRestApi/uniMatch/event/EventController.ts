import { Request, Response } from 'express';
import { IEventRepository } from '@/core/uniMatch/event/application/ports/IEventRepository';
import { Event } from '@/core/uniMatch/event/domain/Event';
import { IEventBus } from '@/core/shared/application/IEventBus';
import { GetEventsCommand } from '@/core/uniMatch/event/application/commands/GetEventsCommand';
import { GetEventCommand } from '@/core/uniMatch/event/application/commands/GetEventCommand';
import { GetEventDTO } from '@/core/uniMatch/event/application/DTO/GetEventDTO';
import { CreateNewEventCommand } from '@/core/uniMatch/event/application/commands/CreateNewEventCommand';
import { Result } from '@/core/shared/domain/Result';
import { FileHandler } from '@/core/uniMatch/event/infrastructure/FileHandler';
import { EditEventCommand } from '@/core/uniMatch/event/application/commands/EditEventCommand';

export class EventController {
    private readonly eventRepository: IEventRepository;
    private readonly eventBus: IEventBus;
    private readonly fileHandler: FileHandler;

    constructor(eventRepository: IEventRepository, eventBus: IEventBus) {
        this.eventRepository = eventRepository;
        this.eventBus = eventBus;
        this.fileHandler = new FileHandler();
    }

    async getAll(req: Request, res: Response): Promise<void> {
        var query = new GetEventsCommand(this.eventRepository);
        return query.run().then((result: Result<Event[]>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                res.status(400).json({ error: result.getErrorMessage() });
            }
        });
    }

    async getOne(req: Request, res: Response): Promise<void> {
        var query = new GetEventCommand(this.eventRepository);
        var dto = { eventId: req.params.id } as GetEventDTO;
        return query.run(dto).then((result: Result<Event>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                res.status(400).json({ error: result.getErrorMessage() });
            }
         });
    }

    async create(req: Request, res: Response): Promise<void> {
        var command = new CreateNewEventCommand(this.eventRepository, this.fileHandler, this.eventBus);
        return command.run(req.body).then((result: Result<Event>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                res.status(400).json({ error: result.getErrorMessage() });
            }
        });
    }

    async update(req: Request, res: Response): Promise<void> {
        var command = new EditEventCommand(this.eventRepository, this.eventBus, this.fileHandler);
        return command.run(req.body).then((result: Result<Event | Error>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();

            }
        });
    }
}
