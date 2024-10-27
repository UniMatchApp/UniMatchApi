import { Entity, Column, Unique } from 'typeorm';

@Entity('events')
@Unique(['id'])
export class EventEntity {
  @Column({type: 'uuid', primary: true})
  id!: string;

  @Column( { type: 'text', nullable: true })
  title!: string;

  @Column({ type: 'float', nullable: true })
  price?: number;

  @Column('float')
  latitude!: number;

  @Column('float')
  longitude!: number;

  @Column({ type: 'float', nullable: true })
  altitude?: number;

  @Column({ type: 'timestamp', nullable: true })
  date!: Date;

  @Column({ type: 'uuid', nullable: true })
  ownerId!: string;

  @Column('text', { array: true, default: [] })
  participants!: string[];

  @Column('text', { array: true, default: [] })
  likes!: string[];

  @Column({ nullable: true, type: 'text' })
  thumbnail?: string;
}
