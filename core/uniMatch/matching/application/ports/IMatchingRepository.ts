import {IRepository} from "@/core/shared/application/IRepository";
import { Node } from "../../domain/Node";
import { Like } from "../../domain/relations/Like";
import { Dislike } from "../../domain/relations/Dislike";

export interface IMatchingRepository extends IRepository<Node> {
    findByUserId(userId: string): Promise<Node | undefined>;
    findUsersThatLikeUser(userId: string): Promise<Node[]>;
    likeUser(like: Like): Promise<void>;
    dislikeUser(dislike: Dislike): Promise<void>;
    findPotentialMatches(userId: string, limit: number): Promise<Node[]>;
    findMutualLikes(userId: string): Promise<Node[]>;
    deleteByUserId(userId: string): Promise<void>;
}