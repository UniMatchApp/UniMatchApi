import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('Profile')
@Unique(['id', 'userId'])
export class ProfileEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    userId!: string;

    @Column({ nullable: true, type: 'text' })
    name!: string;

    @Column({ type: 'int' })
    age!: number;

    @Column({ type: 'text' })
    aboutMe!: string;

    @Column({ type: 'float' })
    latitude!: number;

    @Column({ type: 'float' })
    longitude!: number;

    @Column({ type: 'float', nullable: true })
    altitude?: number;

    @Column({ nullable: true, type: 'text' })
    fact?: string;

    @Column('text', { array: true, default: [] })
    interests!: string[];

    @Column({ type: 'text' })
    gender!: string;

    @Column({ type: 'int', nullable: true })
    height?: number;

    @Column({ type: 'int', nullable: true })
    weight?: number;

    @Column({ type: 'text' })
    sexualOrientation!: string;

    @Column({ type: 'text', nullable: true })
    job?: string;

    @Column({ type: 'text' })
    relationshipType!: string;

    @Column({ type: 'text', nullable: true })
    horoscope?: string;

    @Column({ type: 'text', nullable: true })
    education?: string;

    @Column({ type: 'text', nullable: true })
    personalityType?: string;

    @Column({ type: 'text', nullable: true })
    pets?: string;

    @Column({ type: 'text', nullable: true })
    drinks?: string;

    @Column({ type: 'text', nullable: true })
    smokes?: string ;

    @Column({ type: 'text', nullable: true })
    doesSports?: string ;

    @Column({ type: 'text', nullable: true })
    valuesAndBeliefs?: string ;

    @Column('text', { array: true, default: [] })
    wall!: string[];

    @Column({ type: 'text' })
    preferredImage!: string;

    @Column({ type: 'date' })
    birthday!: Date;

    @Column('int', { default: 50 })
    maxDistance!: number;

    @Column('int', { array: true, default: [18, 100] })
    ageRange!: [number, number];

    @Column({ type: 'text', nullable: true })
    genderPriority?: string | null;
}
