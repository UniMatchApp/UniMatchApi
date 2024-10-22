import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('reported_users')
export class ReportedUsersEntity {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column()
    userId!: string;

    @Column()
    predefinedReason!: string;

    @Column({ nullable: true })
    comment!: string;
}