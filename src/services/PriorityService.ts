import { Priority } from '../tasks/Priority.js';
import { listTasks } from './taskService.js';
import { ITask } from '../tasks/ITask.js';

export class PriorityService {
    private priorities = new Map<number, Priority>();

    setPriority(taskId: number, priority: Priority): void {
        this.priorities.set(taskId, priority);
    }

    getPriority(taskId: number): Priority {
        return this.priorities.get(taskId) || Priority.NORMAL;
    }

    getPriorityName(priority: Priority): string {
        switch (priority) {
            case Priority.CRITICAL: return "CRÍTICA";
            case Priority.HIGH:     return "ALTA";
            case Priority.LOW:      return "BAIXA";
            case Priority.NORMAL:   return "NORMAL";
            default:                return "NORMAL";
        }
    }

    getHighPriorityTasks(): ITask[] {
        const urgentIds: number[] = [];
        this.priorities.forEach((priority, taskId) => {
            if (priority === Priority.HIGH || priority === Priority.CRITICAL) {
                urgentIds.push(taskId);
            }
        });
        return listTasks.filter(task => urgentIds.includes(task.id));
    }

    getPriorityColor(priority: Priority): string {
        switch (priority) {
            case Priority.CRITICAL: return "#e74c3c";
            case Priority.HIGH:     return "#f39c12";
            case Priority.LOW:      return "#3498db";
            case Priority.NORMAL:   return "#2ecc71";
            default:                return "#2ecc71"; 
        }
    }
}

export const priorityService = new PriorityService();