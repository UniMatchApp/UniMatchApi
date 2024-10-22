import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('Profile')
export class ProfileEntity {
    @Column(Unique)
    id!: string;

    @Column(Unique)
    userId!: string;

    @Column()
    name!: string;

    @Column()
    age!: number;

    @Column()
    aboutMe!: string;

    @Column('float')
    latitude!: number;

    @Column('float')
    longitude!: number;

    @Column({ type: 'float', nullable: true })
    altitude?: number;

    @Column({ nullable: true })
    fact?: string;

    @Column('text', { array: true, default: [] })
    interests!: string[];

    @Column()
    gender!: string;

    @Column({ nullable: true })
    height?: number;

    @Column({ nullable: true })
    weight?: number;

    @Column()
    sexualOrientation!: string;

    @Column({ nullable: true })
    job?: string;

    @Column()
    relationshipType!: string;

    @Column({ nullable: true })
    horoscope?: string;

    @Column({ nullable: true })
    education?: string;

    @Column({ nullable: true })
    personalityType?: string;

    @Column({ nullable: true })
    pets?: string;

    @Column({ nullable: true })
    drinks?: string;

    @Column({ nullable: true })
    smokes?: string;

    @Column({ nullable: true })
    doesSports?: string;

    @Column({ nullable: true })
    valuesAndBeliefs?: string;

    @Column('text', { array: true, default: [] })
    wall!: string[];

    @Column()
    preferredImage!: string;

    @Column()
    birthday!: Date;

    @Column('int', { default: 50 })
    maxDistance!: number;

    @Column('int', { array: true, default: [18, 100] })
    ageRange!: [number, number];

    @Column({ nullable: true })
    genderPriority?: string;

}