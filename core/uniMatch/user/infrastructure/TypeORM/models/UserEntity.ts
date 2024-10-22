import { Entity, Column, Unique } from "typeorm";
import { ReportedUsersEntity } from "./ReportedUsersEntity";

@Entity('users')
export class UserEntity {
    @Column(Unique)
    id!: string;

    @Column()
    code!: string;

    @Column()
    registrationDate!: Date;

    @Column(Unique)
    email!: string;

    @Column()
    password!: string;

    @Column('text', { array: true, default: [] })
    blockedUsers!: string[];

    @Column('json', { array: true, default: [] })
    reportedUsers!: ReportedUsersEntity[];
}
