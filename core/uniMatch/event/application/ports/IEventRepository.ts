import {IRepository} from "@/core/shared/application/IRepository";
import {Event} from "@/core/uniMatch/event/domain/Event";

export interface IEventRepository extends IRepository<Event> {}