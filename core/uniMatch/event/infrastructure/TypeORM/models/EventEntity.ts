import { Entity, Column, Unique } from 'typeorm';

@Entity('events')
@Unique(['id'])
export class EventEntity {
  @Column()
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
