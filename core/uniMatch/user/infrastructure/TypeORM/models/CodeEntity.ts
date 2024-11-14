import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Unique } from "typeorm";
import { UserEntity } from "./UserEntity";

@Entity('codes')
@Unique(['user'])
export class CodeEntity {
    @Column({ type: 'text'})
    code!: string;

    @OneToOne(() => UserEntity, user => user.code, { onDelete: 'CASCADE' })
    @JoinColumn()
    user!: UserEntity;
}
