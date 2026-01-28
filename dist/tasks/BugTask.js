import { TaskStatus } from './TaskStatus.js';
export class BugTask {
    id;
    userId;
    title;
    completed = false;
    status = TaskStatus.CREATED;
    constructor(id, title, userId) {
        this.id = id;
        this.title = title;
        this.userId = userId;
    }
    getType() {
        return "bug";
    }
    moveTo(newStatus) {
        if (this.status === TaskStatus.BLOCKED && newStatus === TaskStatus.COMPLETED) {
            console.error("ERRO: Não é possível completar um bug que está BLOQUEADO.");
            return;
        }
        if (this.status === TaskStatus.CREATED && newStatus === TaskStatus.COMPLETED) {
            console.warn("Aviso: Bugs devem ser atribuídos ou iniciados antes de completados.");
        }
        this.status = newStatus;
        this.completed = (newStatus === TaskStatus.COMPLETED || newStatus === TaskStatus.ARCHIVED);
        console.log(`Bug #${this.id} movido para ${newStatus}`);
    }
}
