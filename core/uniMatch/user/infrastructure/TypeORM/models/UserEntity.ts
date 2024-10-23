import { Entity, Column, Unique } from "typeorm";
import { ReportedUsersEntity } from "./ReportedUsersEntity";

@Entity('users')
@Unique(['id', 'email'])
export class UserEntity {
    @Column()
    id!: string;

    @Column()
    code!: string;

    @Column()
    registrationDate!: Date;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column('text', { array: true, default: [] })
    blockedUsers!: string[];

    @Column('json', { array: true, default: [] })
    reportedUsers!: ReportedUsersEntity[];
}
