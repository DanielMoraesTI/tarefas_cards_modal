import { ITask } from '../tasks/ITask.js';
import { Task } from '../models/task.js';
import { BugTask } from '../tasks/BugTask.js';
import { Priority } from '../tasks/Priority.js';
import { priorityService } from './PriorityService.js';
import { deadlineService } from './DeadlineService.js';
import { assignmentService } from './AssignmentService.js';

export let listTasks: ITask[] = [];

export const setListTasks = (newList: ITask[]) => {
    listTasks = newList;
};

export function removeTasksByUserId(userId: number): void {
    setListTasks(listTasks.filter(t => t.userId !== userId));
}

export function createFakeTasksIfEmpty(): void {
    if (listTasks.length > 0) return;
    const now = Date.now();

    const t1 = new Task(1001, 1, 'Revisar contrato de cliente X', 'Audiência' as any, 'Civil' as any);
    (t1 as any).tag = 'contrato';
    listTasks.push(t1);
    priorityService.setPriority(t1.id, Priority.HIGH);
    deadlineService.setDeadline(t1.id, new Date(now + 1000 * 60 * 60 * 24 * 3));
    assignmentService.assignUser(t1.id, 3);

    const t2 = new Task(1002, 2, 'Preparar audiência inicial - processo Y', 'Atendimento' as any, 'Civil' as any);
    (t2 as any).tag = 'audiencia';
    listTasks.push(t2);
    priorityService.setPriority(t2.id, Priority.NORMAL);
    deadlineService.setDeadline(t2.id, new Date(now + 1000 * 60 * 60 * 24 * 7));
    assignmentService.assignUser(t2.id, 4);

    const b1 = new BugTask(1003, 'Erro no formulário de cadastro de clientes', 1);
    (b1 as any).tag = 'bug';
    listTasks.push(b1);
    priorityService.setPriority(b1.id, Priority.CRITICAL);
    assignmentService.assignUser(b1.id, 1);

    const t3 = new Task(1004, 5, 'Analisar prova documental do caso Z', 'Análise' as any, 'Penal' as any);
    (t3 as any).tag = 'documentos';
    listTasks.push(t3);
    priorityService.setPriority(t3.id, Priority.LOW);
    deadlineService.setDeadline(t3.id, new Date(now + 1000 * 60 * 60 * 24 * 2));
    assignmentService.assignUser(t3.id, 5);
}


