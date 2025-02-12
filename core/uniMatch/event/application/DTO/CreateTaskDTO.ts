import { TaskDTO } from "./TaskDTO";

export interface CreateTaskDTO {
    eventId: string,
    userId: string,
    task: TaskDTO
}