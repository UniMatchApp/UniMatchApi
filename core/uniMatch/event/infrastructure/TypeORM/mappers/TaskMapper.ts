import { TaskEntity } from '../models/TaskEntity';
import { Task } from '../../../domain/Task';

export class TaskMapper {
  static toDomain(entity: TaskEntity): Task {
    const task = new Task(entity.title, []);
    entity.options.forEach(optionSet => {
        optionSet.forEach(option => {
            task.addOption(option);
        });
    });
    return task;
  }

  static toEntity(task: Task): TaskEntity {
    const entity = new TaskEntity();
    entity.title = task.title;
    entity.options = task.options;
    return entity;
  }
}
