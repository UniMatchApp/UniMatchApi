import { User } from "../../../domain/User";
import { UserEntity } from "../models/UserEntity";
import { ReportedUsersEntity } from "../models/ReportedUsersEntity";

export class UserMapper {
    static toDomain(entity: UserEntity): User {
        const user = new User(
            entity.registrationDate,
            entity.email,
            entity.password,
            entity.blockedUsers
        );
        user.setId(entity.id);
        user.reportedUsers = entity.reportedUsers.map(reported => ({
            userId: reported.userId,
            predefinedReason: reported.predefinedReason,
            comment: reported.comment
        }));
        return user;
    }

    static toEntity(user: User): UserEntity {
        const entity = new UserEntity();
        entity.id = user.getId().toString();
        entity.code = user.code;
        entity.registrationDate = user.registrationDate;
        entity.email = user.email;
        entity.password = user.password;
        entity.blockedUsers = user.blockedUsers;
        entity.reportedUsers = user.reportedUsers.map(reported => {
            const reportedEntity = new ReportedUsersEntity();
            reportedEntity.id = reported.id;
            reportedEntity.userId = reported.userId;
            reportedEntity.predefinedReason = reported.predefinedReason;
            reportedEntity.comment = reported.comment || "";
            return reportedEntity;
        });

        return entity;
    }
}