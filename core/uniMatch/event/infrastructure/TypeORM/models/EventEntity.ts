import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'float', nullable: true })
  price?: number;

  @Column('float')
  latitude!: number;

  @Column('float')
  longitude!: number;

  @Column({ type: 'float', nullable: true })
  altitude?: number;

  @Column()
  date!: Date;

  @Column()
  ownerId!: string;

  @Column('text', { array: true, default: [] })
  participants!: string[];

  @Column('text', { array: true, default: [] })
  likes!: string[];

  @Column({ nullable: true })
  thumbnail?: string;
}
