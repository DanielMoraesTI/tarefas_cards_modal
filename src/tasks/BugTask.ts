// tasks/BugTask.ts
import { ITask } from './ITask.js';
import { TaskStatus } from './TaskStatus.js';
import { BaseEntity } from '../models/BaseEntity.js';
import { BusinessRules } from '../services/BusinessRules.js';
import { SystemLogger } from '../logs/SystemLogger.js';

export class BugTask extends BaseEntity implements ITask {
    // Retiramos a declaração de 'id' aqui pois ela vem de BaseEntity
    public userId: number;
    public title: string;
    public completed: boolean = false;
    public status: TaskStatus = TaskStatus.CREATED;

    private static bugCount: number = 0;

    // Mudamos a ordem: id vem por último para ser opcional
    constructor(title: string, userId: number, id?: number) {
        super(id);
        this.title = title;
        this.userId = userId;

        BugTask.bugCount++;
        SystemLogger.log(`[BugTask] Novo bug criado. Total: ${BugTask.bugCount}`);
    }

    public static getBugCount(): number {
        return BugTask.bugCount;
    }

    getType(): string {
        return "bug";
    }

    moveTo(newStatus: TaskStatus): void {
        if (newStatus === TaskStatus.COMPLETED) {
            const isBlocked = this.status === TaskStatus.BLOCKED;
            if (!BusinessRules.canTaskBeCompleted(isBlocked)) return;
        }

        this.status = newStatus;
        this.completed = (newStatus === TaskStatus.COMPLETED || newStatus === TaskStatus.ARCHIVED);
        SystemLogger.log(`Bug #${this.id} movido para ${newStatus}`);
    }
}