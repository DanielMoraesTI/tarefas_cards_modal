export class AssignmentService {
    taskToUsers = new Map();
    userToTasks = new Map();
    assignUser(taskId, userId) {
        if (!this.taskToUsers.has(taskId)) {
            this.taskToUsers.set(taskId, new Set());
        }
        this.taskToUsers.get(taskId).add(userId);
        if (!this.userToTasks.has(userId)) {
            this.userToTasks.set(userId, new Set());
        }
        this.userToTasks.get(userId).add(taskId);
    }
    unassignUser(taskId, userId) {
        if (this.taskToUsers.has(taskId)) {
            this.taskToUsers.get(taskId).delete(userId);
        }
        if (this.userToTasks.has(userId)) {
            this.userToTasks.get(userId).delete(taskId);
        }
    }
    /**
     * Remove um usuário de todas as tarefas às quais ele está atribuído.
     * Necessário para a automação de usuários inativos.
     * @param userId
     */
    unassignUserFromAllTasks(userId) {
        const associatedTasks = this.userToTasks.get(userId);
        if (associatedTasks) {
            associatedTasks.forEach(taskId => {
                const usersInTask = this.taskToUsers.get(taskId);
                if (usersInTask) {
                    usersInTask.delete(userId);
                }
            });
            this.userToTasks.delete(userId);
        }
    }
    getUsersFromTask(taskId) {
        const users = this.taskToUsers.get(taskId);
        return users ? Array.from(users) : [];
    }
    getTasksFromUser(userId) {
        const tasks = this.userToTasks.get(userId);
        return tasks ? Array.from(tasks) : [];
    }
}
export const assignmentService = new AssignmentService();
