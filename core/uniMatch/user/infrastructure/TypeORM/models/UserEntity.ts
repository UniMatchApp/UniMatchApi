import { Entity, Column, Unique, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReportedUsersEntity } from "./ReportedUsersEntity";
import { CodeEntity } from "./CodeEntity";

@Entity('users')
@Unique(['id', 'email'])
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => CodeEntity, code => code.user, { cascade: true })
    code!: CodeEntity;

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
