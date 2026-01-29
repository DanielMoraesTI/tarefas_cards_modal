import { ITask } from '../tasks/ITask.js';
import { TaskStatus } from '../tasks/TaskStatus.js';
import { UserClass } from '../models/UserClass.js';
import { auditLog } from '../utils/HistoryLog.js';
import { notificationService } from './NotificationService.js';
import { assignmentService } from './AssignmentService.js';
import { deadlineService } from './DeadlineService.js';

class AutomationRulesService {
    
    private ruleTaskCompleted(task: ITask): void {
        if (task.completed || task.status === TaskStatus.COMPLETED) {
            auditLog.addLog(`AUTOMAÇÃO: Tarefa "${task.title}" (ID: ${task.id}) marcada como CONCLUÍDA.`);
        }
    }

    private ruleTaskBlocked(task: ITask): void {
        if (task.status === TaskStatus.BLOCKED) {
            console.warn(`Notificação: A tarefa "${task.title}" está BLOQUEADA.`);
        }
    }

    private ruleTaskExpired(task: ITask): void {
        const deadline = deadlineService.getDeadlineDate(task.id);
        
        if (deadline && new Date(deadline) < new Date() && task.status !== TaskStatus.COMPLETED) {
            if (task.status !== TaskStatus.BLOCKED) {
                task.status = TaskStatus.BLOCKED;
                auditLog.addLog(`AUTOMAÇÃO: Tarefa "${task.title}" expirou e foi movida para BLOQUEADA.`);
                this.ruleTaskBlocked(task);
            }
        }
    }

    private ruleUserInactive(user: UserClass): void {
        if (!user.isActive()) {
            assignmentService.unassignUserFromAllTasks(user.getId);
            auditLog.addLog(`AUTOMAÇÃO: Utilizador "${user.name}" inativo. Atribuições removidas.`);
        }
    }

    public applyRules(task: ITask): void {
        this.ruleTaskCompleted(task);
        this.ruleTaskBlocked(task);
        this.ruleTaskExpired(task);
    }

    public applyUserRules(user: UserClass): void {
        this.ruleUserInactive(user);
    }
}

export const automationRulesService = new AutomationRulesService();