import { TaskStatus } from '../tasks/TaskStatus.js';
import { auditLog } from '../utils/HistoryLog.js';
import { assignmentService } from './AssignmentService.js';
import { deadlineService } from './DeadlineService.js';
class AutomationRulesService {
    ruleTaskCompleted(task) {
        if (task.completed || task.status === TaskStatus.COMPLETED) {
            auditLog.addLog(`AUTOMAÇÃO: Tarefa "${task.title}" (ID: ${task.id}) marcada como CONCLUÍDA.`);
        }
    }
    ruleTaskBlocked(task) {
        if (task.status === TaskStatus.BLOCKED) {
            console.warn(`Notificação: A tarefa "${task.title}" está BLOQUEADA.`);
        }
    }
    ruleTaskExpired(task) {
        const deadline = deadlineService.getDeadlineDate(task.id);
        if (deadline && new Date(deadline) < new Date() && task.status !== TaskStatus.COMPLETED) {
            if (task.status !== TaskStatus.BLOCKED) {
                task.status = TaskStatus.BLOCKED;
                auditLog.addLog(`AUTOMAÇÃO: Tarefa "${task.title}" expirou e foi movida para BLOQUEADA.`);
                this.ruleTaskBlocked(task);
            }
        }
    }
    ruleUserInactive(user) {
        if (!user.isActive()) {
            assignmentService.unassignUserFromAllTasks(user.getId);
            auditLog.addLog(`AUTOMAÇÃO: Utilizador "${user.name}" inativo. Atribuições removidas.`);
        }
    }
    applyRules(task) {
        this.ruleTaskCompleted(task);
        this.ruleTaskBlocked(task);
        this.ruleTaskExpired(task);
    }
    applyUserRules(user) {
        this.ruleUserInactive(user);
    }
}
export const automationRulesService = new AutomationRulesService();
