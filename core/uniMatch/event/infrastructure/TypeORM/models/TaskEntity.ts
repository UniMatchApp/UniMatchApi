import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { EventEntity } from './EventEntity';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column('jsonb', { default: [] })
  options!: Map<string, Set<string>>;

  @ManyToOne(() => EventEntity, event => event.tasks)
  event!: EventEntity;
}
