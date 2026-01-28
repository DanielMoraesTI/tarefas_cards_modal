import { Attachment } from '../models/Attachment.js';

export class AttachmentService {
    private attachments: Attachment[] = [];
    private nextId: number = 1;

    public addAttachment(taskId: number, filename: string, size: string, url: string): Attachment {
        const newAttachment = new Attachment(this.nextId++, taskId, filename, size, url);
        this.attachments.push(newAttachment);
        return newAttachment;
    }

    public getAttachments(taskId: number): Attachment[] {
        return this.attachments.filter(a => a.taskId === taskId);
    }

    public removeAttachment(attachmentId: number): void {
        this.attachments = this.attachments.filter(a => a.getId !== attachmentId);
    }
}