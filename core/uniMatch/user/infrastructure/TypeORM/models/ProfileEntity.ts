import { Entity, Column, PrimaryGeneratedColumn, Unique, PrimaryColumn } from "typeorm";

@Entity('Profile')
@Unique(['userId'])
export class ProfileEntity {
    @PrimaryColumn({ type: 'uuid' })
    id!: string;

    @Column({ type: 'uuid' })
    userId!: string;

    @Column({ nullable: true, type: 'text' })
    name!: string;

    @Column({ type: 'int' })
    age!: number;

    @Column({ type: 'text' })
    aboutMe!: string;

    @Column({ type: 'float', nullable: true })
    latitude?: number | null;

    @Column({ type: 'float', nullable: true })
    longitude?: number | null;

    @Column({ type: 'float', nullable: true })
    altitude?: number | null;

    @Column({ nullable: true, type: 'text' })
    fact?: string | null;

    @Column('json')
    interests!: string[];

    @Column({ type: 'text' })
    gender!: string;

    @Column({ type: 'int', nullable: true })
    height?: number | null;

    @Column({ type: 'int', nullable: true })
    weight?: number | null;

    @Column({ type: 'text' })
    sexualOrientation!: string;

    @Column({ type: 'text', nullable: true })
    job?: string | null;

    @Column({ type: 'text' })
    relationshipType!: string;

    @Column({ type: 'text', nullable: true })
    horoscope?: string | null;

    @Column({ type: 'text', nullable: true })
    education?: string | null;

    @Column({ type: 'text', nullable: true })
    personalityType?: string | null;

    @Column({ type: 'text', nullable: true })
    pets?: string | null;

    @Column({ type: 'text', nullable: true })
    drinks?: string | null;

    @Column({ type: 'text', nullable: true })
    smokes?: string | null;

    @Column({ type: 'text', nullable: true })
    doesSports?: string | null;

    @Column({ type: 'text', nullable: true })
    valuesAndBeliefs?: string | null;

    @Column('json')
    wall!: string[];

    @Column({ type: 'text' })
    preferredImage!: string;

    @Column({ type: 'date' })
    birthday!: Date;

    @Column('int', { default: 50 })
    maxDistance!: number;

    @Column('json')
    ageRange!: [number, number];

    @Column({ type: 'text', nullable: true })
    genderPriority?: string | null;
}
