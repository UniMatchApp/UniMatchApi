import {Request, Response} from 'express';
import {UserDislikedSomebodyCommand} from '@/core/uniMatch/matching/application/commands/userDislikedSomebodyCommand';
import {UserDislikedSomebodyDTO} from '@/core/uniMatch/matching/application/DTO/userDislikedSomebodyDTO';
import {ErrorHandler} from '../../utils/ErrorHandler';
import {Result} from "@/core/shared/domain/Result";
import {UserLikedSomebodyCommand} from '@/core/uniMatch/matching/application/commands/userLikedSomebodyCommand';
import {UserLikedSomebodyDTO} from '@/core/uniMatch/matching/application/DTO/userLikedSomebodyDTO';
import {IEventBus} from '@/core/shared/application/IEventBus';
import {IMatchingRepository} from "@/core/uniMatch/matching/application/ports/IMatchingRepository";
import {Node} from '@/core/uniMatch/matching/domain/Node';
import {GetUsersThatLikeUserCommand} from "@/core/uniMatch/matching/application/commands/getUsersThatLikeUserCommand";
import {
    GetUserPotentialMatchesCommand
} from '@/core/uniMatch/matching/application/commands/GetUserPotentialMatchesCommand';
import {
    GetUsersWithMutualLikesCommand
} from '@/core/uniMatch/matching/application/commands/GetUsersWithMutualLikesCommand';
import {GetUserPotentialMatchesDTO} from '@/core/uniMatch/matching/application/DTO/GetUserPotentialMatchesDTO';
import {GetUsersWithMutualLikesDTO} from '@/core/uniMatch/matching/application/DTO/GetUsersWithMutualLikesDTO';
import {IProfileRepository} from "@/core/uniMatch/user/application/ports/IProfileRepository";
import {ProfileDTO} from "@/core/uniMatch/user/application/DTO/ProfileDTO";

export class MatchingController {

    private readonly matchingRepository: IMatchingRepository;
    private readonly eventBus: IEventBus
    private readonly profileRepository: IProfileRepository;

    constructor(matchingRepository: IMatchingRepository,
                profileRepository: IProfileRepository,
                eventBus: IEventBus) {
        this.matchingRepository = matchingRepository;
        this.profileRepository = profileRepository;
        this.eventBus = eventBus;
    }

    async userDislikedSomebody(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const dislikedUserId = req.body.dislikedUserId;
        const command = new UserDislikedSomebodyCommand(this.matchingRepository);
        const dto = {userId: userId, dislikedUserId: dislikedUserId} as UserDislikedSomebodyDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async userLikedSomebody(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const likedUserId = req.body.likedUserId;
        const command = new UserLikedSomebodyCommand(this.matchingRepository);
        const dto = {userId: userId, likedUserId: likedUserId} as UserLikedSomebodyDTO;
        return command.run(dto).then((result: Result<void>) => {
            if (result.isSuccess()) {
                res.json(result);
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
                res.json(result);
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
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }

    async getMutualLikes(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const dto = {userId: userId} as GetUsersWithMutualLikesDTO;
        console.warn("GET MUTUAL LIKES: " + dto.userId);
        const command = new GetUsersWithMutualLikesCommand(this.matchingRepository, this.profileRepository);
        return command.run(dto).then((result: Result<ProfileDTO[]>) => {
            if (result.isSuccess()) {
                res.json(result);
            } else {
                const error = result.getError();
                ErrorHandler.handleError(error, res);
            }
        });
    }
}