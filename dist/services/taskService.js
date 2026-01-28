import { Task } from '../models/task.js';
import { BugTask } from '../tasks/BugTask.js';
import { Priority } from '../tasks/Priority.js';
import { priorityService } from './PriorityService.js';
import { deadlineService } from './DeadlineService.js';
import { assignmentService } from './AssignmentService.js';
export let listTasks = [];
export const setListTasks = (newList) => {
    listTasks = newList;
};
export function removeTasksByUserId(userId) {
    setListTasks(listTasks.filter(t => t.userId !== userId));
}
export function createFakeTasksIfEmpty() {
    if (listTasks.length > 0)
        return;
    const now = Date.now();
    const t1 = new Task(1001, 1, 'Revisar contrato de cliente X', 'Audiência', 'Civil');
    t1.tag = 'contrato';
    listTasks.push(t1);
    priorityService.setPriority(t1.id, Priority.HIGH);
    deadlineService.setDeadline(t1.id, new Date(now + 1000 * 60 * 60 * 24 * 3));
    assignmentService.assignUser(t1.id, 3);
    const t2 = new Task(1002, 2, 'Preparar audiência inicial - processo Y', 'Atendimento', 'Civil');
    t2.tag = 'audiencia';
    listTasks.push(t2);
    priorityService.setPriority(t2.id, Priority.NORMAL);
    deadlineService.setDeadline(t2.id, new Date(now + 1000 * 60 * 60 * 24 * 7));
    assignmentService.assignUser(t2.id, 4);
    const b1 = new BugTask(1003, 'Erro no formulário de cadastro de clientes', 1);
    b1.tag = 'bug';
    listTasks.push(b1);
    priorityService.setPriority(b1.id, Priority.CRITICAL);
    assignmentService.assignUser(b1.id, 1);
    const t3 = new Task(1004, 5, 'Analisar prova documental do caso Z', 'Análise', 'Penal');
    t3.tag = 'documentos';
    listTasks.push(t3);
    priorityService.setPriority(t3.id, Priority.LOW);
    deadlineService.setDeadline(t3.id, new Date(now + 1000 * 60 * 60 * 24 * 2));
    assignmentService.assignUser(t3.id, 5);
}
