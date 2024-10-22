import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ReportedUsersEntity } from "./ReportedUsersEntity";
import { json } from "stream/consumers";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
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
