import {IRepository} from "@/core/shared/application/IRepository";
import { SessionStatus } from "../../domain/SessionStatus";

export interface ISessionStatusRepository extends IRepository<SessionStatus> {}