import { Entity, Column, Unique } from 'typeorm';

@Entity('events')
@Unique(['id'])
export class EventEntity {
  @Column({ type: 'uuid', primary: true })
  id!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'float', nullable: true })
  price?: number | null;

  @Column({ type: 'float' })
  latitude!: number;

  @Column({ type: 'float' })
  longitude!: number;

  @Column({ type: 'float', nullable: true })
  altitude?: number | null;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'uuid' })
  ownerId!: string;

  @Column('text', { array: true, default: [] })
  participants!: string[];

  @Column('text', { array: true, default: [] })
  likes!: string[];

  @Column({ type: 'text', nullable: true })
  thumbnail?: string | null;
}
