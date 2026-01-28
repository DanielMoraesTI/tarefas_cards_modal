import { listTasks } from './taskService.js';
export class DeadlineService {
    deadlines = new Map();
    setDeadline(taskId, date) {
        this.deadlines.set(taskId, date.getTime());
    }
    getCurrentTime() {
        return Date.now();
    }
    isExpired(taskId) {
        const deadline = this.deadlines.get(taskId);
        if (!deadline)
            return false;
        return this.getCurrentTime() > deadline;
    }
    getExpiredTasks() {
        const expiredIds = [];
        this.deadlines.forEach((timestamp, taskId) => {
            if (this.isExpired(taskId)) {
                expiredIds.push(taskId);
            }
        });
        return listTasks.filter(task => expiredIds.includes(task.id));
    }
    getDeadlineDate(taskId) {
        const timestamp = this.deadlines.get(taskId);
        return timestamp ? new Date(timestamp).toLocaleDateString('pt-PT') : null;
    }
}
export const deadlineService = new DeadlineService();
