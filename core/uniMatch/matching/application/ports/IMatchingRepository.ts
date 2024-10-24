import {IRepository} from "@/core/shared/application/IRepository";
import { Node } from "../../domain/Node";
import { Like } from "../../domain/relations/Like";
import { Dislike } from "../../domain/relations/Dislike";

export interface IMatchingRepository extends IRepository<Node> {
    findByUserId(userId: string): Promise<Node | undefined>;
    likeUser(like: Like): Promise<void>;
    dislikeUser(dislike: Dislike): Promise<void>;
}