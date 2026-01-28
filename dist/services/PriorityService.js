import { Priority } from '../tasks/Priority.js';
import { listTasks } from './taskService.js';
export class PriorityService {
    priorities = new Map();
    setPriority(taskId, priority) {
        this.priorities.set(taskId, priority);
    }
    getPriority(taskId) {
        return this.priorities.get(taskId) || Priority.NORMAL;
    }
    getPriorityName(priority) {
        switch (priority) {
            case Priority.CRITICAL: return "CRÍTICA";
            case Priority.HIGH: return "ALTA";
            case Priority.LOW: return "BAIXA";
            case Priority.NORMAL: return "NORMAL";
            default: return "NORMAL";
        }
    }
    getHighPriorityTasks() {
        const urgentIds = [];
        this.priorities.forEach((priority, taskId) => {
            if (priority === Priority.HIGH || priority === Priority.CRITICAL) {
                urgentIds.push(taskId);
            }
        });
        return listTasks.filter(task => urgentIds.includes(task.id));
    }
    getPriorityColor(priority) {
        switch (priority) {
            case Priority.CRITICAL: return "#e74c3c";
            case Priority.HIGH: return "#f39c12";
            case Priority.LOW: return "#3498db";
            case Priority.NORMAL: return "#2ecc71";
            default: return "#2ecc71";
        }
    }
}
export const priorityService = new PriorityService();
