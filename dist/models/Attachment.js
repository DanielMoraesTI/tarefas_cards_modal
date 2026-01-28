import { BaseEntity } from './BaseEntity.js';
export class Attachment extends BaseEntity {
    taskId;
    filename;
    size;
    url;
    constructor(id, taskId, filename, size, url) {
        super(id);
        this.taskId = taskId;
        this.filename = filename;
        this.size = size;
        this.url = url;
    }
}
