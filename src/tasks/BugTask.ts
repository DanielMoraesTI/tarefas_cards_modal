import { ITask } from './ITask.js';
import { TaskStatus } from './TaskStatus.js';

export class BugTask implements ITask {
    public id: number;
    public userId: number;
    public title: string;
    public completed: boolean = false;
    public status: TaskStatus = TaskStatus.CREATED;

    constructor(id: number, title: string, userId: number) {
        this.id = id;
        this.title = title;
        this.userId = userId;
    }

    getType(): string {
        return "bug";
    }

    moveTo(newStatus: TaskStatus): void {
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