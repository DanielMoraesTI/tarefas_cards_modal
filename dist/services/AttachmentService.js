import { Attachment } from '../models/Attachment.js';
export class AttachmentService {
    attachments = [];
    nextId = 1;
    addAttachment(taskId, filename, size, url) {
        const newAttachment = new Attachment(this.nextId++, taskId, filename, size, url);
        this.attachments.push(newAttachment);
        return newAttachment;
    }
    getAttachments(taskId) {
        return this.attachments.filter(a => a.taskId === taskId);
    }
    removeAttachment(attachmentId) {
        this.attachments = this.attachments.filter(a => a.getId !== attachmentId);
    }
}
