import { BaseEntity } from './BaseEntity.js';
import { ITask } from '../tasks/ITask.js';
import { TaskStatus } from '../tasks/TaskStatus.js';
import { workCategoria, subjectCategoria } from '../utils/utilTypes.js';

export class Task extends BaseEntity implements ITask {
    public completed: boolean = false;
    public status: TaskStatus = TaskStatus.CREATED; 
    public concludedAt?: Date;

    constructor(
        public id: number,
        public userId: number,
        public title: string,
        public category: workCategoria,
        public subject: subjectCategoria
    ) {
        super(id);
    }

    public getType(): string {
        return "Tarefa Geral";
    }

    public moveTo(newStatus: TaskStatus): void {
        this.status = newStatus;
        
        if (newStatus === TaskStatus.COMPLETED) {
            this.completed = true;
            this.concludedAt = new Date();
        } else {
            this.completed = false;
            this.concludedAt = undefined;
        }
    }
}





