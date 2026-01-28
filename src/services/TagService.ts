import { listTasks } from './taskService.js';
import { ITask } from '../tasks/ITask.js';

export class TagService {
    private taskTags: Map<number, Set<string>> = new Map();

    public addTag(taskId: number, tag: string): void {
        const cleanedTag = tag.trim().toLowerCase();
        if (!cleanedTag) return;

        if (!this.taskTags.has(taskId)) {
            this.taskTags.set(taskId, new Set());
        }
        
        this.taskTags.get(taskId)?.add(cleanedTag);
    }

    public removeTag(taskId: number, tag: string): void {
        const cleanedTag = tag.trim().toLowerCase();
        this.taskTags.get(taskId)?.delete(cleanedTag);
    }

    public getTags(taskId: number): string[] {
        const tags = this.taskTags.get(taskId);
        return tags ? Array.from(tags) : [];
    }

    public getTasksByTag(tag: string): ITask[] {
        const cleanedTag = tag.trim().toLowerCase();
        return listTasks.filter(task => {
            const tags = this.taskTags.get(task.id);
            return tags?.has(cleanedTag);
        });
    }
}