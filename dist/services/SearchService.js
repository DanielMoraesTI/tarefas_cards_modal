import { assignmentService } from "./AssignmentService.js";
import { listUsers } from "./index.js";
export class SearchService {
    static searchByText(tasks, text) {
        if (!text.trim())
            return tasks;
        const searchTerm = text.toLowerCase();
        const matchedUserIds = listUsers
            .filter((user) => user.name.toLowerCase().includes(searchTerm))
            .map((user) => user.getId);
        return tasks.filter(task => {
            const matchesTitle = task.title.toLowerCase().includes(searchTerm);
            const isOwnerMatch = matchedUserIds.includes(task.userId);
            const collaborators = assignmentService.getUsersFromTask(task.id);
            const isCollaboratorMatch = collaborators.some(id => matchedUserIds.includes(id));
            return matchesTitle || isOwnerMatch || isCollaboratorMatch;
        });
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
            results = this.searchByText(results, query.text);
        if (query.userId)
            results = this.searchByUser(results, query.userId);
        if (query.status !== undefined && query.status !== null) {
            results = this.searchByStatus(results, query.status);
        }
        return results;
    }
}
