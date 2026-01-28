import { assignmentService } from "./AssignmentService.js";
export class SearchService {
    static searchByTitle(tasks, text) {
        if (!text.trim())
            return tasks;
        const searchTerm = text.toLowerCase();
        return tasks.filter(task => task.title.toLowerCase().includes(searchTerm));
    }
    static searchByUser(tasks, userId) {
        if (!userId || userId < 0)
            return tasks;
        return tasks.filter(task => {
            const isOwner = task.userId === userId;
            const isAssigned = assignmentService.getUsersFromTask(task.id).includes(userId);
            return isOwner || isAssigned;
        });
    }
    static searchByStatus(tasks, status) {
        if (status === undefined || status === null)
            return tasks;
        return tasks.filter(task => task.status === status);
    }
    static globalSearch(tasks, query) {
        let results = tasks;
        if (query.text)
            results = this.searchByTitle(results, query.text);
        if (query.userId)
            results = this.searchByUser(results, query.userId);
        if (query.status !== undefined && query.status !== null)
            results = this.searchByStatus(results, query.status);
        return results;
    }
}
