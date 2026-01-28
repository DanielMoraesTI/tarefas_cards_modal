import { listTasks } from './taskService.js';
import { ITask } from '../tasks/ITask.js';

export class DeadlineService {
    private deadlines = new Map<number, number>();

    setDeadline(taskId: number, date: Date): void {
        this.deadlines.set(taskId, date.getTime());
    }

    private getCurrentTime(): number {
        return Date.now();
    }

    isExpired(taskId: number): boolean {
        const deadline = this.deadlines.get(taskId);
        if (!deadline) return false;

        return this.getCurrentTime() > deadline;
    }

    getExpiredTasks(): ITask[] {
        const expiredIds: number[] = [];

        this.deadlines.forEach((timestamp, taskId) => {
            if (this.isExpired(taskId)) {
                expiredIds.push(taskId);
            }
        });

        return listTasks.filter(task => expiredIds.includes(task.id));
    }

    getDeadlineDate(taskId: number): string | null {
        const timestamp = this.deadlines.get(taskId);
        return timestamp ? new Date(timestamp).toLocaleDateString('pt-PT') : null;
    }
}

export const deadlineService = new DeadlineService();