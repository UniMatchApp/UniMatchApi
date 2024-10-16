import {IRepository} from "@/core/shared/application/IRepository";
import { Status } from "../../domain/Status";

export interface IStatusRepository extends IRepository<Status> {}