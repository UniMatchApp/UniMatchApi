import { fa } from "@faker-js/faker/.";
import { Entity, Column, Unique } from "typeorm";

@Entity('reported_users')
@Unique(['id'])
export class ReportedUsersEntity {
    @Column({ type: 'uuid', primary: true })
    id!: string;

    @Column({ type: 'uuid' })
    userId!: string;

    @Column({ type: 'text' })
    predefinedReason!: string;

    @Column({ type: 'text', nullable: true })
    comment?: string;

    @Column({ type: 'text', nullable: false })
    details!: string;

    @Column({ type: 'text', nullable: false })
    timestamp!: string; // ISO 8601 format
}
