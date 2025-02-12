import { Task } from "../../domain/Task";

export interface TaskDTO {
    title: string;
    options: string[];
    selections: { [option: string]: string[] } | undefined;
  }
  
  export class TaskMapper {
    static map(task: Task): TaskDTO {
      return {
        title: task.title,
        options: Array.from(task.options.keys()),
        selections: task.selections,
      };
    }
  }