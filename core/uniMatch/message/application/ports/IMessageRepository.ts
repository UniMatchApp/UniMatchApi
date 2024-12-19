import {IRepository} from "@/core/shared/application/IRepository";
import { Message } from "../../domain/Message";

export interface IMessageRepository extends IRepository<Message> {
    findLastMessagesOfUser(userId: string): Promise<Message[]>;
    findLastMessagesBetweenUsers(userId: string, otherUserId: string): Promise<Message[]>;
    findMessagesBetweenUsersPaginated(userId: string, otherUserId: string, after: number, limit: number): Promise<Message[]>;
    findMessagesOfUserPaginated(userId: string, after: number, limit: number): Promise<Message[]>;
}