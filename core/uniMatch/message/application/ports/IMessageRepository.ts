import {IRepository} from "../../../../shared/application/IRepository";
import { Message } from "../../domain/Message";

export interface IMessageRepository extends IRepository<Message> {}