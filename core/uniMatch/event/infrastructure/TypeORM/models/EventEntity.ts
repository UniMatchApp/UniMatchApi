import { Entity, Column, Unique } from 'typeorm';

@Entity('events')
export class EventEntity {
  @Column(Unique)
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
