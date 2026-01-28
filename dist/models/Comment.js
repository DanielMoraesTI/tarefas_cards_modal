import { BaseEntity } from './BaseEntity.js';
export class Comment extends BaseEntity {
    taskId;
    userId;
    message;
    constructor(id, taskId, userId, message) {
        super(id);
        this.taskId = taskId;
        this.userId = userId;
        this.message = message;
    }
}
