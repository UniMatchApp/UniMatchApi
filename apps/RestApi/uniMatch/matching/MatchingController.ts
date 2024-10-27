import { Request, Response } from 'express';  
import { Neo4JMatchingRepository } from "@/core/uniMatch/matching/infrastructure/neo4j/repositories/Neo4JMatchingRepository";
import { UserDislikedSomebodyCommand } from '@/core/uniMatch/matching/application/commands/userDislikedSomebodyCommand';
import { UserDislikedSomebodyDTO } from '@/core/uniMatch/matching/application/DTO/userDislikedSomebodyDTO';
import { ErrorHandler } from '../../ErrorHandler';
import { Result } from "@/core/shared/domain/Result";
import { UserLikedSomebodyCommand } from '@/core/uniMatch/matching/application/commands/userLikedSomebodyCommand';
import { UserLikedSomebodyDTO } from '@/core/uniMatch/matching/application/DTO/userLikedSomebodyDTO';
import { IEventBus } from '@/core/shared/application/IEventBus';
import {IMatchingRepository} from "@/core/uniMatch/matching/application/ports/IMatchingRepository";

export class MatchingController {
  
    private readonly matchingRepository: IMatchingRepository;
    private readonly eventBus: IEventBus

    constructor(matchingRepository: IMatchingRepository, eventBus: IEventBus) {
        this.matchingRepository = matchingRepository;
        this.eventBus = eventBus;
    }

    async userDislikedSomebody(req: Request, res: Response): Promise<void> {
        var userId = req.params.userId;
        var dislikedUserId = req.body.dislikedUserId;
        var command = new UserDislikedSomebodyCommand(this.matchingRepository);
        var dto = { userId: userId, dislikedUserId: dislikedUserId } as UserDislikedSomebodyDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async userLikedSomebody(req: Request, res: Response): Promise<void> {
        var userId = req.params.userId;
        var likedUserId = req.body.likedUserId;
        var command = new UserLikedSomebodyCommand(this.matchingRepository);
        var dto = { userId: userId, likedUserId: likedUserId } as UserLikedSomebodyDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

}