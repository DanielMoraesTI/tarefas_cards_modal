import { TaskStatus } from './TaskStatus.js';
import { BaseEntity } from '../models/BaseEntity.js'; // Ajustado o caminho (está em models/)
import { BusinessRules } from '../services/BusinessRules.js';
import { SystemLogger } from '../logs/SystemLogger.js';
export class BugTask extends BaseEntity {
    // Retiramos a declaração de 'id' aqui pois ela vem de BaseEntity
    userId;
    title;
    completed = false;
    status = TaskStatus.CREATED;
    static bugCount = 0;
    // Mudamos a ordem: id vem por último para ser opcional
    constructor(title, userId, id) {
        super(id); // O super agora recebe o id opcional
        this.title = title;
        this.userId = userId;
        BugTask.bugCount++;
        SystemLogger.log(`[BugTask] Novo bug criado. Total: ${BugTask.bugCount}`);
    }
    static getBugCount() {
        return BugTask.bugCount;
    }
    getType() {
        return "bug";
    }
    moveTo(newStatus) {
        if (newStatus === TaskStatus.COMPLETED) {
            const isBlocked = this.status === TaskStatus.BLOCKED;
            if (!BusinessRules.canTaskBeCompleted(isBlocked))
                return;
        }
        this.status = newStatus;
        this.completed = (newStatus === TaskStatus.COMPLETED || newStatus === TaskStatus.ARCHIVED);
        SystemLogger.log(`Bug #${this.id} movido para ${newStatus}`);
    }
}
