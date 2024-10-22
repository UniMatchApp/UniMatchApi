import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

    @Column('text', { array: true, default: [] })
    reportedUsers!: { userId: string, predefinedReason: string, comment?: string }[];
}
