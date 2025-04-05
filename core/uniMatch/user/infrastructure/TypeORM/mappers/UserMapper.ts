import { User } from "../../../domain/User";
import { UserEntity } from "../models/UserEntity";
import { ReportedUsersEntity } from "../models/ReportedUsersEntity";
import { ReportedUser } from "../../../domain/ReportedUser";

export class UserMapper {
    static toDomain(entity: UserEntity): User {
        const user = new User(
            entity.email,
            entity.password,
            entity.notificationToken,
            entity.blockedUsers
        );
        user.setId(entity.id);

        user.privateKey = entity.privateKey;

        user.registered = entity.registered;

        user.registrationDate = entity.registrationDate;

        user.reportedUsers = entity.reportedUsers.map(reported => {
            const reportedUser = new ReportedUser(
                reported.userId,
                reported.predefinedReason,
                reported.details,
                reported.comment,
                reported.timestamp
            );
            reportedUser.setId(reported.id);
            return reportedUser;
        });
        console.log(`UserMapper.toDomain: ${JSON.stringify(user)}`);
        return user;
    }

    static toEntity(user: User): UserEntity {
        const entity = new UserEntity();
        entity.id = user.getId().toString();

        entity.registrationDate = user.registrationDate;
        entity.email = user.email;
        entity.password = user.password;
        entity.blockedUsers = user.blockedUsers;
        entity.registered = user.registered;
        entity.reportedUsers = user.reportedUsers.map(reported => {
            const reportedEntity = new ReportedUsersEntity();
            reportedEntity.id = reported.getId().toString();
            reportedEntity.userId = reported.userId;
            reportedEntity.predefinedReason = reported.predefinedReason;
            reportedEntity.details = reported.details;
            reportedEntity.timestamp = reported.timestamp;
            reportedEntity.comment = reported.comment || "";
            return reportedEntity;
        });
        entity.privateKey = user.privateKey;
        entity.notificationToken = user.notificationToken;

        return entity;
    }
}
