import { Entity, Column, Unique } from "typeorm";

@Entity('reported_users')
export class ReportedUsersEntity {
    @Column(Unique)
    id!: string;

    @Column()
    userId!: string;

    @Column()
    predefinedReason!: string;

    @Column({ nullable: true })
    comment!: string;
}