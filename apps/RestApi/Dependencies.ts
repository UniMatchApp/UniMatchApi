import {InMemoryEventBus} from "@/core/shared/infrastructure/eventBus/InMemoryEventBus";
import {WebSocketsClientHandler} from "@/core/shared/infrastructure/clientHandler/WebSocketsClientHandler";
import {
    InMemorySessionStatusRepository
} from "@/core/uniMatch/status/infrastructure/InMemory/InMemorySessionStatusRepository";
import {IEmailNotifications} from "@/core/shared/application/IEmailNotifications";
import {MockEmailNotifications} from "@/core/shared/infrastructure/notifications/MockEmailNotifications";
import {FileHandler} from "@/core/shared/infrastructure/fileHandler/FileHandler";
import {IProfileRepository} from "@/core/uniMatch/user/application/ports/IProfileRepository";
import {InMemoryProfileRepository} from "@/core/uniMatch/user/infrastructure/InMemory/InMemoryProfileRepository";
import {IEventRepository} from "@/core/uniMatch/event/application/ports/IEventRepository";
import {InMemoryEventRepository} from "@/core/uniMatch/event/infrastructure/InMemory/InMemoryEventRepository";
import {InMemoryMatchingRepository} from "@/core/uniMatch/matching/infrastructure/InMemory/InMemoryMatchingRepository";
import {IMatchingRepository} from "@/core/uniMatch/matching/application/ports/IMatchingRepository";
import {IMessageRepository} from "@/core/uniMatch/message/application/ports/IMessageRepository";
import {InMemoryMessageRepository} from "@/core/uniMatch/message/infrastructure/InMemory/InMemoryMessageRepository";
import {AppNotifications} from "@/core/uniMatch/notifications/infrastructure/AppNotifications";
import {INotificationsRepository} from "@/core/uniMatch/notifications/application/ports/INotificationsRepository";
import {
    InMemoryNotificationRepository
} from "@/core/uniMatch/notifications/infrastructure/InMemory/InMemoryNotificationRepository";
import {IAppNotifications} from "@/core/uniMatch/notifications/application/ports/IAppNotifications";
import {InMemoryUserRepository} from "@/core/uniMatch/user/infrastructure/InMemory/InMemoryUserRepository";
import {IUserRepository} from "@/core/uniMatch/user/application/ports/IUserRepository";
import {TypeORMUserRepository} from "@/core/uniMatch/user/infrastructure/TypeORM/repositories/TypeORMUserRepository";
import {
    TypeORMProfileRepository
} from "@/core/uniMatch/user/infrastructure/TypeORM/repositories/TypeORMProfileRepository";
import {EmailNotifications} from "@/core/shared/infrastructure/notifications/EmailNotifications";
import {
    TypeORMNotificationRepository
} from "@/core/uniMatch/notifications/infrastructure/TypeORM/repositories/TypeORMNotificationRepository";
import {
    TypeORMMessageRepository
} from "@/core/uniMatch/message/infrastructure/TypeORM/repositories/TypeORMMessageRepository";
import {
    Neo4JMatchingRepository
} from "@/core/uniMatch/matching/infrastructure/neo4j/repositories/Neo4JMatchingRepository";
import {
    RedisSessionStatusRepository
} from "@/core/uniMatch/status/infrastructure/redis/repositories/RedisSessionStatusRepository";
import {ISessionStatusRepository} from "@/core/uniMatch/status/application/ports/ISessionStatusRepository";
import {IFileHandler} from "@/core/shared/application/IFileHandler";
import {S3FileHandler} from "@/core/shared/infrastructure/fileHandler/S3FileHandler";
import {
    DeletedMessageEventHandler
} from "@/core/uniMatch/notifications/application/handlers/DeletedMessageEventHandler";
import {EditMessageEventHandler} from "@/core/uniMatch/notifications/application/handlers/EditMessageEventHandler";
import {
    EventIsDeletedEventHandler
} from "@/core/uniMatch/notifications/application/handlers/EventIsDeletedEventHandler";
import {
    EventIsGoingToExpireEventHandler
} from "@/core/uniMatch/notifications/application/handlers/EventIsGoingToExpireEventHandler";
import {
    EventIsModifiedEventHandler
} from "@/core/uniMatch/notifications/application/handlers/EventIsModifiedEventHandler";
import {NewDislikeEventHandler} from "@/core/uniMatch/notifications/application/handlers/NewDislikeEventHandler";
import {NewLikeEventHandler} from "@/core/uniMatch/notifications/application/handlers/NewLikeEventHandler";
import {NewMessageEventHandler} from "@/core/uniMatch/notifications/application/handlers/NewMessageEventHandler";
import {
    UserHasChangedEmailEventHandler
} from "@/core/uniMatch/notifications/application/handlers/UserHasChangedEmailEventHandler";
import {
    UserHasChangedPasswordEventHandler
} from "@/core/uniMatch/notifications/application/handlers/UserHasChangedPasswordEventHandler";
import {NewProfileEventHandler} from "@/core/uniMatch/matching/application/handlers/NewProfileEventHandler";
import {
    UserHasChangedAgeEventHandler
} from "@/core/uniMatch/matching/application/handlers/UserHasChangedAgeEventHandler";
import {
    UserHasChangedLocationEventHandler
} from "@/core/uniMatch/matching/application/handlers/UserHasChangedLocationEventHandler";
import {
    UserHasChangedMaxDistanceEventHandler
} from "@/core/uniMatch/matching/application/handlers/UserHasChangedMaxDistanceEventHandler";
import {
    UserHasChangedSexPriorityEventHandler
} from "@/core/uniMatch/matching/application/handlers/UserHasChangedSexPriorityEventHandler";
import {
    UserHasChangedTypeOfRelationshipEventHandler
} from "@/core/uniMatch/matching/application/handlers/UserHasChangedTypeOfRelationshipEventHandler";

export class DependencyContainer {
    // Dependencias compartidas
    readonly eventBus = new InMemoryEventBus();
    readonly wsClientHandler = new WebSocketsClientHandler();

    // Propiedades que dependen de la configuración
    fileHandler: IFileHandler;
    sessionStatusRepository: ISessionStatusRepository;
    eventRepository: IEventRepository;
    matchingRepository: IMatchingRepository;
    messageRepository: IMessageRepository;
    notificationsRepository: INotificationsRepository;
    appNotifications: IAppNotifications;
    emailNotifications: IEmailNotifications;
    userRepository: IUserRepository;
    profileRepository: IProfileRepository;

    constructor(private useMocks: boolean) {

        this.fileHandler = this.createFileHandler();
        this.sessionStatusRepository = this.createSessionStatusRepository();
        this.eventRepository = this.createEventRepository();
        this.matchingRepository = this.createMatchingRepository();
        this.messageRepository = this.createMessageRepository();
        this.notificationsRepository = this.createNotificationsRepository();
        this.appNotifications = new AppNotifications(this.wsClientHandler);
        this.emailNotifications = this.createEmailNotifications();
        this.userRepository = this.createUserRepository();
        this.profileRepository = this.createProfileRepository();

        this.subscribeHandlers();

        console.log(this.constructor.name + " using -> " + (this.useMocks ? "Mocks" : "Real implementations"));
    }
    
    private createFileHandler(): IFileHandler {
        return !this.useMocks ? new FileHandler() : new S3FileHandler();
    }

    private createSessionStatusRepository(): ISessionStatusRepository {
        return this.useMocks ? new InMemorySessionStatusRepository() : new RedisSessionStatusRepository();
    }

    private createEventRepository(): IEventRepository {
        return this.useMocks ? new InMemoryEventRepository() : new InMemoryEventRepository(); // Cambiar cuando esté disponible
    }

    private createMatchingRepository(): IMatchingRepository {
        return this.useMocks ? new InMemoryMatchingRepository() : new Neo4JMatchingRepository();
    }

    private createMessageRepository(): IMessageRepository {
        return this.useMocks ? new InMemoryMessageRepository() : new TypeORMMessageRepository();
    }

    private createNotificationsRepository(): INotificationsRepository {
        return this.useMocks ? new InMemoryNotificationRepository() : new TypeORMNotificationRepository();
    }

    private createEmailNotifications(): IEmailNotifications {
        return !this.useMocks ? new MockEmailNotifications() : new EmailNotifications();
    }

    private createUserRepository(): IUserRepository {
        return this.useMocks ? new InMemoryUserRepository() : new TypeORMUserRepository();
    }

    private createProfileRepository(): IProfileRepository {
        return this.useMocks ? new InMemoryProfileRepository() : new TypeORMProfileRepository();
    }


    subscribeHandlers(){
        this.eventBus.subscribe(new DeletedMessageEventHandler(this.appNotifications, this.notificationsRepository));
        this.eventBus.subscribe(new EditMessageEventHandler(this.appNotifications, this.notificationsRepository));
        this.eventBus.subscribe(new EventIsDeletedEventHandler(this.notificationsRepository, this.appNotifications));
        this.eventBus.subscribe(new EventIsGoingToExpireEventHandler(this.notificationsRepository, this.appNotifications));
        this.eventBus.subscribe(new EventIsModifiedEventHandler(this.notificationsRepository, this.appNotifications));
        this.eventBus.subscribe(new NewDislikeEventHandler(this.notificationsRepository, this.appNotifications));
        this.eventBus.subscribe(new NewLikeEventHandler(this.notificationsRepository, this.appNotifications));
        this.eventBus.subscribe(new NewMessageEventHandler(this.notificationsRepository, this.appNotifications));
        this.eventBus.subscribe(new UserHasChangedEmailEventHandler(this.notificationsRepository, this.emailNotifications));
        this.eventBus.subscribe(new UserHasChangedPasswordEventHandler(this.notificationsRepository, this.emailNotifications));

        this.eventBus.subscribe(new NewProfileEventHandler(this.matchingRepository));
        this.eventBus.subscribe(new UserHasChangedAgeEventHandler(this.matchingRepository));
        this.eventBus.subscribe(new UserHasChangedLocationEventHandler(this.matchingRepository));
        this.eventBus.subscribe(new UserHasChangedMaxDistanceEventHandler(this.matchingRepository));
        this.eventBus.subscribe(new UserHasChangedSexPriorityEventHandler(this.matchingRepository));
        this.eventBus.subscribe(new UserHasChangedTypeOfRelationshipEventHandler(this.matchingRepository));
    }

}

export const dependencies = new DependencyContainer(false);

