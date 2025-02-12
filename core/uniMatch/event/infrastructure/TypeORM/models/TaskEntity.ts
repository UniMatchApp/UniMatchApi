import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { EventEntity } from './EventEntity';

@Entity('surveys')
export class SurveyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  title!: string;

  @Column('jsonb', { default: [] })
  options!: Map<string, Set<string>>;

  @ManyToOne(() => EventEntity, event => event.surveys)
  event!: EventEntity;
}
