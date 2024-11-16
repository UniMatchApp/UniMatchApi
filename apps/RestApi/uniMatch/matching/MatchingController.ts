import {Request, Response} from 'express';
import {UserDislikedSomebodyCommand} from '@/core/uniMatch/matching/application/commands/userDislikedSomebodyCommand';
import {UserDislikedSomebodyDTO} from '@/core/uniMatch/matching/application/DTO/userDislikedSomebodyDTO';
import {ErrorHandler} from '../../ErrorHandler';
import {Result} from "@/core/shared/domain/Result";
import {UserLikedSomebodyCommand} from '@/core/uniMatch/matching/application/commands/userLikedSomebodyCommand';
import {UserLikedSomebodyDTO} from '@/core/uniMatch/matching/application/DTO/userLikedSomebodyDTO';
import {IEventBus} from '@/core/shared/application/IEventBus';
import {IMatchingRepository} from "@/core/uniMatch/matching/application/ports/IMatchingRepository";
import {NewProfileEventHandler} from '@/core/uniMatch/matching/application/handlers/NewProfileEventHandler';
import {Node} from '@/core/uniMatch/matching/domain/Node';
import {
    UserHasChangedAgeEventHandler
} from '@/core/uniMatch/matching/application/handlers/UserHasChangedAgeEventHandler';
import {
    UserHasChangedLocationEventHandler
} from '@/core/uniMatch/matching/application/handlers/UserHasChangedLocationEventHandler';
import {
    UserHasChangedMaxDistanceEventHandler
} from '@/core/uniMatch/matching/application/handlers/UserHasChangedMaxDistanceEventHandler';
import {
    UserHasChangedSexPriorityEventHandler
} from '@/core/uniMatch/matching/application/handlers/UserHasChangedSexPriorityEventHandler';
import {
    UserHasChangedTypeOfRelationshipEventHandler
} from '@/core/uniMatch/matching/application/handlers/UserHasChangedTypeOfRelationshipEventHandler';
import {GetUsersThatLikeUserCommand} from "@/core/uniMatch/matching/application/commands/getUsersThatLikeUserCommand";
import { GetUserPotentialMatchesCommand } from '@/core/uniMatch/matching/application/commands/GetUserPotentialMatchesCommand';
import { GetUsersWithMutualLikesCommand } from '@/core/uniMatch/matching/application/commands/GetUsersWithMutualLikesCommand';
import { GetUserPotentialMatchesDTO } from '@/core/uniMatch/matching/application/DTO/GetUserPotentialMatchesDTO';
import { GetUsersWithMutualLikesDTO } from '@/core/uniMatch/matching/application/DTO/GetUsersWithMutualLikesDTO';

export class MatchingController {

    private readonly matchingRepository: IMatchingRepository;
    private readonly eventBus: IEventBus

    constructor(matchingRepository: IMatchingRepository, eventBus: IEventBus) {
        this.matchingRepository = matchingRepository;
        this.eventBus = eventBus;
        this.eventBus.subscribe(new NewProfileEventHandler(this.matchingRepository));
        this.eventBus.subscribe(new UserHasChangedAgeEventHandler(this.matchingRepository));
        this.eventBus.subscribe(new UserHasChangedLocationEventHandler(this.matchingRepository));
        this.eventBus.subscribe(new UserHasChangedMaxDistanceEventHandler(this.matchingRepository));
        this.eventBus.subscribe(new UserHasChangedSexPriorityEventHandler(this.matchingRepository));
        this.eventBus.subscribe(new UserHasChangedTypeOfRelationshipEventHandler(this.matchingRepository));
    }

    async userDislikedSomebody(req: Request, res: Response): Promise<void> {
        var userId = req.params.userId;
        var dislikedUserId = req.body.dislikedUserId;
        var command = new UserDislikedSomebodyCommand(this.matchingRepository);
        var dto = {userId: userId, dislikedUserId: dislikedUserId} as UserDislikedSomebodyDTO;
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
        var dto = {userId: userId, likedUserId: likedUserId} as UserLikedSomebodyDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async usersThatLikedUser(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const command = new GetUsersThatLikeUserCommand(this.matchingRepository);
        return command.run(userId).then((result: Result<string[]>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async getUserPotentialMatches(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const limit = req.body.limit;
        const dto = {userId: userId, limit: limit} as GetUserPotentialMatchesDTO;
        const command = new GetUserPotentialMatchesCommand(this.matchingRepository);
        return command.run(dto).then((result: Result<Node[]>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async getMutualLikes(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const dto = {userId: userId} as GetUsersWithMutualLikesDTO;
        const command = new GetUsersWithMutualLikesCommand(this.matchingRepository);
        return command.run(dto).then((result: Result<Node[]>) => {
            if (result.isSuccess()) {
                res.json(result.getValue());
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }
}