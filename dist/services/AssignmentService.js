import { listUsers } from './index.js';
import { BusinessRules } from './BusinessRules.js';
import { SystemLogger } from '../logs/SystemLogger.js';
export class AssignmentService {
    taskToUsers = new Map();
    userToTasks = new Map();
    assignUser(taskId, userId) {
        const user = listUsers.find((u) => u.getId === userId);
        if (!user || !BusinessRules.canAssignTask(user.isActive())) {
            const reason = !user ? "não existe" : "está inativo";
            SystemLogger.log(`[Assignment] Falha ao atribuir: Utilizador ${userId} ${reason}.`);
            return;
        }
        if (!this.taskToUsers.has(taskId)) {
            this.taskToUsers.set(taskId, new Set());
        }
        this.taskToUsers.get(taskId).add(userId);
        if (!this.userToTasks.has(userId)) {
            this.userToTasks.set(userId, new Set());
        }
        this.userToTasks.get(userId).add(taskId);
        SystemLogger.log(`[Assignment] Sucesso: Utilizador ${user.name} (ID: ${userId}) atribuído à tarefa ${taskId}.`);
    }
    unassignUser(taskId, userId) {
        if (this.taskToUsers.has(taskId)) {
            this.taskToUsers.get(taskId).delete(userId);
        }
        if (this.userToTasks.has(userId)) {
            this.userToTasks.get(userId).delete(taskId);
        }
        SystemLogger.log(`[Assignment] Remoção: Utilizador ${userId} removido da tarefa ${taskId}.`);
    }
    /**
     * Remove um usuário de todas as tarefas às quais ele está atribuído.
     * Necessário para a automação de usuários inativos.
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
            SystemLogger.log(`[Assignment] Limpeza Global: Utilizador ${userId} removido de todas as tarefas por inatividade.`);
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
