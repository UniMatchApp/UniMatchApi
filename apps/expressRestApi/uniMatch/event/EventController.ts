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
import { ErrorHandler } from '../../ErrorHandler';
import { DeleteEventCommand } from '@/core/uniMatch/event/application/commands/DeleteEventCommand';
import { LikeEventCommand } from '@/core/uniMatch/event/application/commands/LikeEventCommand';
import { DislikeEventCommand } from '@/core/uniMatch/event/application/commands/DislikeEventCommand';
import { ParticipateEventCommand } from '@/core/uniMatch/event/application/commands/ParticipateEventCommand';
import { RemoveParticipationCommand } from '@/core/uniMatch/event/application/commands/RemoveParticipationCommand';
import { EditEventDTO } from '@/core/uniMatch/event/application/DTO/EditEventDTO';
import { DeleteEventDTO } from '@/core/uniMatch/event/application/DTO/DeleteEventDTO';
import { LikeEventDTO } from '@/core/uniMatch/event/application/DTO/LikeEventDTO';
import { ParticipateEventDTO } from '@/core/uniMatch/event/application/DTO/ParticipateEventDTO';

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
                const error = result.getError();
                ErrorHandler.handleError(error, res);
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
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
         });
    }

    async create(req: Request, res: Response): Promise<void> {
        var command = new CreateNewEventCommand(this.eventRepository, this.fileHandler, this.eventBus);
        return command.run(req.body).then((result: Result<Event>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async update(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var command = new EditEventCommand(this.eventRepository, this.eventBus, this.fileHandler);
        var dto = { eventId: id, ...req.body } as EditEventDTO;
        return command.run(dto).then((result: Result<Event>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async delete(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var command = new DeleteEventCommand(this.eventRepository, this.eventBus, this.fileHandler);
        var dto = { eventId: id } as DeleteEventDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async likeEvent(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var userId = req.body.userId;
        var command = new LikeEventCommand(this.eventRepository);
        var dto = { eventId: id, userId: userId } as LikeEventDTO;
        return command.run(dto).then((result: Result<Event>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async dislikeEvent(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var userId = req.body.userId;
        var command = new DislikeEventCommand(this.eventRepository);
        var dto = { eventId: id, userId: userId } as LikeEventDTO;
        return command.run(dto).then((result: Result<Event>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async participateEvent(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var userId = req.body.userId;
        var command = new ParticipateEventCommand(this.eventRepository);
        var dto = { eventId: id, userId: userId } as ParticipateEventDTO;
        return command.run(dto).then((result: Result<Event>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async removeParticipation(req: Request, res: Response): Promise<void> {
        var id = req.params.id;
        var userId = req.body.userId;
        var command = new RemoveParticipationCommand(this.eventRepository);
        var dto = { eventId: id, userId: userId } as ParticipateEventDTO;
        return command.run(dto).then((result: Result<Event>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }
}