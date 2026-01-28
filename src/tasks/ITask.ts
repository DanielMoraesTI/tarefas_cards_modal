import { TaskStatus } from './TaskStatus';

export interface ITask {
    id: number;
    userId: number;
    title: string;
    completed: boolean;
    status: TaskStatus;
    getType(): string;
    moveTo(status: TaskStatus): void;
}