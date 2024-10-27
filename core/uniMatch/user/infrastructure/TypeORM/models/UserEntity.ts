import { Entity, Column, Unique } from "typeorm";
import { ReportedUsersEntity } from "./ReportedUsersEntity";

@Entity('users')
@Unique(['id', 'email'])
export class UserEntity {
    @Column({ type: 'uuid', primary: true })
    id!: string;

    @Column({ type: 'text' })
    code!: string;

    @Column({ type: 'timestamp' })
    registrationDate!: Date;

    @Column({ type: 'text' })
    email!: string;

    @Column({ type: 'text' })
    password!: string;

    @Column('text', { array: true, default: [] })
    blockedUsers!: string[];

    @Column('json', { array: true, default: [] })
    reportedUsers!: ReportedUsersEntity[];
}
