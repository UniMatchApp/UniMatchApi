import {InMemoryEventBus} from "@/core/shared/infrastructure/InMemoryEventBus";
import {TypeORMUserRepository} from "@/core/uniMatch/user/infrastructure/TypeORM/repositories/TypeORMUserRepository";
import {WebSocketController} from "@/apps/RestApi/WS/WebSocketsController";
import {
    RedisSessionStatusRepository
} from "@/core/uniMatch/status/infrastructure/redis/repositories/RedisSessionStatusRepository";
import {WebSocketsClientHandler} from "@/apps/RestApi/WS/WebSocketsClientHandler";
import {
    InMemorySessionStatusRepository
} from "@/core/uniMatch/status/infrastructure/InMemory/InMemorySessionStatusRepository";
import {IEmailNotifications} from "@/core/shared/application/IEmailNotifications";
import {EmailNotifications} from "@/core/shared/infrastructure/EmailNotifications";
import {MockEmailNotifications} from "@/core/shared/infrastructure/MockEmailNotifications";
import { FileHandler } from "@/core/uniMatch/event/infrastructure/FileHandler";

export const eventBus = new InMemoryEventBus();
export const wsClientHandler = new WebSocketsClientHandler();
// const sessionStatusRepository = new RedisSessionStatusRepository();
const sessionStatusRepository = new InMemorySessionStatusRepository();
// export const emailNotifications: IEmailNotifications = new EmailNotifications();
export const emailNotifications: IEmailNotifications = new MockEmailNotifications();

export const fileHandler = new FileHandler();

new WebSocketController(8080, 8081, sessionStatusRepository, wsClientHandler);
