import { BaseEntity } from './BaseEntity.js';
import { TaskStatus } from '../tasks/TaskStatus.js';
export class Task extends BaseEntity {
    id;
    userId;
    title;
    category;
    subject;
    completed = false;
    status = TaskStatus.CREATED;
    concludedAt;
    constructor(id, userId, title, category, subject) {
        super(id);
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.category = category;
        this.subject = subject;
    }
    getType() {
        return "Tarefa Geral";
    }
    moveTo(newStatus) {
        this.status = newStatus;
        if (newStatus === TaskStatus.COMPLETED) {
            this.completed = true;
            this.concludedAt = new Date();
        }
        else {
            this.completed = false;
            this.concludedAt = undefined;
        }
    }
}
