import { Entity, Column, Unique } from "typeorm";

@Entity('reported_users')
@Unique(['id'])
export class ReportedUsersEntity {
    @Column()
    id!: string;

    @Column()
    userId!: string;

    @Column()
    predefinedReason!: string;

    @Column({ nullable: true })
    comment!: string;
}