import { listUsers, listTasks } from './index.js';
import { assignmentService } from './AssignmentService.js';
/**
 * Sistema de backup lógico dos dados
 * Exporta dados em formato de objetos para armazenamento ou transmissão
 */
export class BackupService {
    /**
     * Exporta a lista de usuários
     */
    static exportUsers() {
        return listUsers.map(user => ({
            id: user.getId,
            name: user.name,
            email: user.getEmail(),
            role: user.getRole(),
            isActive: user.isActive(),
        }));
    }
    /**
     * Exporta a lista de tarefas
     */
    static exportTasks() {
        return listTasks.map(task => ({
            id: task.id,
            userId: task.userId,
            title: task.title,
            completed: task.completed,
            category: task.category || null,
            subject: task.subject || null,
            tag: task.tag || null,
        }));
    }
    /**
     * Exporta as relações de assignments (tarefas atribuídas aos usuários)
     */
    static exportAssignments() {
        const assignments = [];
        listTasks.forEach(task => {
            const assignedUsers = assignmentService.getUsersFromTask(task.id);
            assignedUsers.forEach(userId => {
                assignments.push({
                    taskId: task.id,
                    userId: userId,
                });
            });
        });
        return assignments;
    }
    /**
     * Exporta todos os dados num único objeto
     */
    static exportAll() {
        return {
            timestamp: new Date().toISOString(),
            users: this.exportUsers(),
            tasks: this.exportTasks(),
            assignments: this.exportAssignments(),
        };
    }
}
export default BackupService;
