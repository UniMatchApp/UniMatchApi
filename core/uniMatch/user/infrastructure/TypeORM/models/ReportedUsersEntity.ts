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
    comment?: string | null;
}
