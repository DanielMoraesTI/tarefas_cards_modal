import { ITask } from "../tasks/ITask.js";
import { TaskStatus } from "../tasks/TaskStatus.js";
import { assignmentService } from "./AssignmentService.js";
import { listUsers } from "./index.js";
import { UserClass } from "../models/UserClass.js";

export class SearchService {
  
  static searchByText(tasks: ITask[], text: string): ITask[] {
    if (!text.trim()) return tasks;
    const searchTerm = text.toLowerCase();

    const matchedUserIds: number[] = listUsers
      .filter((user: UserClass) => user.name.toLowerCase().includes(searchTerm))
      .map((user: UserClass) => user.getId);

    return tasks.filter(task => {
      const matchesTitle = task.title.toLowerCase().includes(searchTerm);
      
      const isOwnerMatch = matchedUserIds.includes(task.userId);
      
      const collaborators = assignmentService.getUsersFromTask(task.id);
      const isCollaboratorMatch = collaborators.some(id => matchedUserIds.includes(id));

      return matchesTitle || isOwnerMatch || isCollaboratorMatch;
    });
  }

  static searchByUser(tasks: ITask[], userId: number): ITask[] {
    if (!userId || userId < 0) return tasks;
    return tasks.filter(task => {
      const isOwner = task.userId === userId;
      const isAssigned = assignmentService.getUsersFromTask(task.id).includes(userId);
      return isOwner || isAssigned;
    });
  }

  static searchByStatus(tasks: ITask[], status: TaskStatus): ITask[] {
    if (status === undefined || status === null) return tasks;
    return tasks.filter(task => task.status === status);
  }

  static globalSearch(tasks: ITask[], query: { text?: string, userId?: number, status?: TaskStatus }): ITask[] {
    let results = tasks;

    if (query.text) results = this.searchByText(results, query.text);
    
    if (query.userId) results = this.searchByUser(results, query.userId);
    
    if (query.status !== undefined && query.status !== null) {
        results = this.searchByStatus(results, query.status);
    }

    return results;
  }
}