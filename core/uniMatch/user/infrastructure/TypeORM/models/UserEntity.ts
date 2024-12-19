import { Entity, Column, Unique, PrimaryGeneratedColumn } from "typeorm";
import { ReportedUsersEntity } from "./ReportedUsersEntity";

@Entity('users')
@Unique(['id', 'email', 'privateKey'])
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    privateKey!: string;

    @Column({ type: 'timestamp' })
    registrationDate!: Date;

    @Column({ type: 'boolean', default: false })
    registered!: boolean;

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;
    
    @Column({ type: 'text' })
    password!: string;

    @Column('json')
    blockedUsers!: string[];

    @Column('json')
    reportedUsers!: ReportedUsersEntity[];
}
