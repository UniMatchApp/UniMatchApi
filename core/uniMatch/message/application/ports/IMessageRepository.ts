import {IRepository} from "../../../../shared/application/IRepository";
import { Message } from "../../domain/Message";

export interface IMessageRepository extends IRepository<Message> {
    findLastMessagesOfUser(userId: string): Message[];
    findLastMessagesBetweenUsers(userId: string, otherUserId: string): Message[];
}