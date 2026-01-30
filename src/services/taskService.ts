import { ITask } from '../tasks/ITask.js';
import { Task } from '../models/task.js';
import { BugTask } from '../tasks/BugTask.js';
import { Priority } from '../tasks/Priority.js';
import { priorityService } from './PriorityService.js';
import { deadlineService } from './DeadlineService.js';
import { assignmentService } from './AssignmentService.js';
import { SystemLogger } from '../logs/SystemLogger.js';

export let listTasks: ITask[] = [];

export const setListTasks = (newList: ITask[]) => {
    listTasks.splice(0, listTasks.length, ...newList);
};

export function removeTasksByUserId(userId: number): void {
    const tasksToRemove = listTasks.filter(t => t.userId === userId);
    
    tasksToRemove.forEach(task => {
        priorityService.setPriority(task.id, Priority.LOW);
    });

    const filtered = listTasks.filter(t => t.userId !== userId);
    setListTasks(filtered);
    SystemLogger.log(`[TaskService] Removidas tarefas do utilizador ${userId}.`);
}

export function createFakeTasksIfEmpty(): void {
    if (listTasks.length > 0) return;
    const now = Date.now();

    /**
     * ATENÇÃO: Ajustamos a ordem dos parâmetros para: (title, userId, category, subject, id)
     * O ID manual (ex: 1001) passa para o final para permitir que a BaseEntity o use,
     * ou seja omitido para gerar um novo automaticamente.
     */
    
    const t1 = new Task('Revisar contrato de cliente X', 1, 'Audiência' as any, 'Civil' as any, 1001);
    (t1 as any).tag = 'contrato';
    
    const t2 = new Task('Preparar audiência inicial - processo Y', 2, 'Atendimento' as any, 'Civil' as any, 1002);
    (t2 as any).tag = 'audiencia';

    /**
     * Para o BugTask: a ordem agora é (title, userId, id)
     * Antes: new BugTask(1003, 'Erro...', 1) -> Errado
     * Agora: new BugTask('Erro...', 1, 1003) -> Correto
     */
    const b1 = new BugTask('Erro no formulário de cadastro de clientes', 1, 1003);
    (b1 as any).tag = 'bug';

    const t3 = new Task('Analisar prova documental do caso Z', 5, 'Análise' as any, 'Penal' as any, 1004);
    (t3 as any).tag = 'documentos';

    listTasks.push(t1, t2, b1, t3);

    // Configurações de serviços auxiliares - O .id agora é reconhecido como public pela BaseEntity
    priorityService.setPriority(t1.id, Priority.HIGH);
    deadlineService.setDeadline(t1.id, new Date(now + 1000 * 60 * 60 * 24 * 3));
    assignmentService.assignUser(t1.id, 3);

    priorityService.setPriority(t2.id, Priority.NORMAL);
    deadlineService.setDeadline(t2.id, new Date(now + 1000 * 60 * 60 * 24 * 7));
    assignmentService.assignUser(t2.id, 4);

    priorityService.setPriority(b1.id, Priority.CRITICAL);
    assignmentService.assignUser(b1.id, 1);

    priorityService.setPriority(t3.id, Priority.LOW);
    deadlineService.setDeadline(t3.id, new Date(now + 1000 * 60 * 60 * 24 * 2));
    assignmentService.assignUser(t3.id, 5);

    SystemLogger.log("[TaskService] Tarefas fictícias criadas com sucesso.");
}