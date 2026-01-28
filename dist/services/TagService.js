import { listTasks } from './taskService.js';
export class TagService {
    taskTags = new Map();
    addTag(taskId, tag) {
        const cleanedTag = tag.trim().toLowerCase();
        if (!cleanedTag)
            return;
        if (!this.taskTags.has(taskId)) {
            this.taskTags.set(taskId, new Set());
        }
        this.taskTags.get(taskId)?.add(cleanedTag);
    }
    removeTag(taskId, tag) {
        const cleanedTag = tag.trim().toLowerCase();
        this.taskTags.get(taskId)?.delete(cleanedTag);
    }
    getTags(taskId) {
        const tags = this.taskTags.get(taskId);
        return tags ? Array.from(tags) : [];
    }
    getTasksByTag(tag) {
        const cleanedTag = tag.trim().toLowerCase();
        return listTasks.filter(task => {
            const tags = this.taskTags.get(task.id);
            return tags?.has(cleanedTag);
        });
    }
}
