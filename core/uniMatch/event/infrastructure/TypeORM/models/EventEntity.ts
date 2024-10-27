import { Entity, Column, Unique } from 'typeorm';

@Entity('events')
@Unique(['id'])
export class EventEntity {
  @Column({ type: 'uuid', primary: true })
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'float', nullable: true })
  price?: number | null;

  @Column({ type: 'float' })
  latitude!: number;

  @Column({ type: 'float' })
  longitude!: number;

  @Column({ type: 'float', nullable: true })
  altitude?: number | null;

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
