import { Entity, Column, Unique, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReportedUsersEntity } from "./ReportedUsersEntity";

@Entity('users')
@Unique(['id', 'email', 'privateKey'])
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'text' })
    privateKey!: string;

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
