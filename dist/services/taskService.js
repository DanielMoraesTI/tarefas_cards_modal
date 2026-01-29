import { Task } from '../models/task.js';
import { BugTask } from '../tasks/BugTask.js';
import { Priority } from '../tasks/Priority.js';
import { priorityService } from './PriorityService.js';
import { deadlineService } from './DeadlineService.js';
import { assignmentService } from './AssignmentService.js';
// Mantemos o let para compatibilidade, mas evitaremos reatribuir a referência
export let listTasks = [];
/**
 * Atualiza a lista de tarefas sem perder a referência original
 */
export const setListTasks = (newList) => {
    listTasks.splice(0, listTasks.length, ...newList);
};
/**
 * Remove tarefas de um usuário e limpa referências em serviços auxiliares
 */
export function removeTasksByUserId(userId) {
    // 1. Identifica as tarefas que serão removidas
    const tasksToRemove = listTasks.filter(t => t.userId === userId);
    // 2. Limpa dados vinculados a essas tarefas em outros serviços
    tasksToRemove.forEach(task => {
        priorityService.setPriority(task.id, Priority.LOW); // Opcional: ou deletar do service
        // Se houver método de delete nos services auxiliares, chame-os aqui
    });
    // 3. Filtra a lista mantendo a referência
    const filtered = listTasks.filter(t => t.userId !== userId);
    setListTasks(filtered);
}
export function createFakeTasksIfEmpty() {
    if (listTasks.length > 0)
        return;
    const now = Date.now();
    const t1 = new Task(1001, 1, 'Revisar contrato de cliente X', 'Audiência', 'Civil');
    t1.tag = 'contrato';
    const t2 = new Task(1002, 2, 'Preparar audiência inicial - processo Y', 'Atendimento', 'Civil');
    t2.tag = 'audiencia';
    const b1 = new BugTask(1003, 'Erro no formulário de cadastro de clientes', 1);
    b1.tag = 'bug';
    const t3 = new Task(1004, 5, 'Analisar prova documental do caso Z', 'Análise', 'Penal');
    t3.tag = 'documentos';
    // Adiciona à lista
    listTasks.push(t1, t2, b1, t3);
    // Configurações de serviços auxiliares
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
}
