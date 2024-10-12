import {IRepository} from "../../../../shared/application/IRepository";
import {Event} from "../../domain/Event";

export interface IEventRepository extends IRepository<Event> {}