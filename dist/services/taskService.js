import { Task } from '../models/task.js';
import { BugTask } from '../tasks/BugTask.js';
import { Priority } from '../tasks/Priority.js';
import { priorityService } from './PriorityService.js';
import { deadlineService } from './DeadlineService.js';
import { assignmentService } from './AssignmentService.js';
import { SystemLogger } from '../logs/SystemLogger.js';
export let listTasks = [];
export const setListTasks = (newList) => {
    listTasks.splice(0, listTasks.length, ...newList);
};
export function removeTasksByUserId(userId) {
    const tasksToRemove = listTasks.filter(t => t.userId === userId);
    tasksToRemove.forEach(task => {
        priorityService.setPriority(task.id, Priority.LOW);
    });
    const filtered = listTasks.filter(t => t.userId !== userId);
    setListTasks(filtered);
    SystemLogger.log(`[TaskService] Removidas tarefas do utilizador ${userId}.`);
}
/**
 * DADOS FAKE DE TAREFAS
 * Todas as tarefas criadas na inicialização da aplicação
 */
function createFakeTasks() {
    // TAREFAS DE DANIEL MORAES (ID 3) - 6 TAREFAS
    const t1 = new Task('Revisar contrato de cliente X', 3, 'Audiência', 'Civil', 1001);
    t1.tag = 'contrato';
    const t2 = new Task('Preparar audiência inicial - processo Y', 3, 'Atendimento', 'Civil', 1002);
    t2.tag = 'audiencia';
    const t3 = new Task('Analisar prova documental do caso Z', 3, 'Análise', 'Penal', 1003);
    t3.tag = 'documentos';
    const t4 = new Task('Preparar recurso extraordinário - Cliente A', 3, 'Audiência', 'Civil', 1004);
    t4.tag = 'recurso';
    const t5 = new Task('Pesquisa jurisprudencial - Tema B', 3, 'Análise', 'Penal', 1005);
    t5.tag = 'pesquisa';
    const t6 = new Task('Redigir petição - Caso C', 3, 'Atendimento', 'Civil', 1006);
    t6.tag = 'petição';
    // TAREFAS DE DANILSON (ID 7) - 11 TAREFAS
    const t7 = new Task('Revisar documentação - Processo 1', 7, 'Análise', 'Trabalhista', 1007);
    t7.tag = 'docs';
    const t8 = new Task('Agendar audiência - Processo 2', 7, 'Audiência', 'Civil', 1008);
    t8.tag = 'agendamento';
    const t9 = new Task('Análise de jurisprudência - Processo 3', 7, 'Análise', 'Penal', 1009);
    t9.tag = 'análise';
    const t10 = new Task('Levantamento de legislação - Processo 4', 7, 'Análise', 'Trabalhista', 1010);
    t10.tag = 'levantamento';
    const t11 = new Task('Consultoria jurídica - Cliente D', 7, 'Atendimento', 'Civil', 1011);
    t11.tag = 'consulta';
    const t12 = new Task('Parecer jurídico - Caso E', 7, 'Análise', 'Civil', 1012);
    t12.tag = 'parecer';
    const t13 = new Task('Acompanhamento processual - Processo 5', 7, 'Atendimento', 'Penal', 1013);
    t13.tag = 'acompanhamento';
    const t14 = new Task('Negociação extrajudicial - Cliente F', 7, 'Atendimento', 'Civil', 1014);
    t14.tag = 'negociação';
    const t15 = new Task('Preparação para julgamento - Processo 6', 7, 'Audiência', 'Penal', 1015);
    t15.tag = 'julgamento';
    const t16 = new Task('Análise de contrato - Cliente G', 7, 'Análise', 'Civil', 1016);
    t16.tag = 'contrato-análise';
    const t17 = new Task('Recurso em revisão - Processo 7', 7, 'Audiência', 'Trabalhista', 1017);
    t17.tag = 'recurso-revisão';
    // TAREFA PARA OUTRO USUÁRIO (para diversificar)
    const b1 = new BugTask('Erro no formulário de cadastro de clientes', 1, 1018);
    b1.tag = 'bug';
    return [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, b1];
}
/**
 * CONFIGURAÇÕES DE PRIORIDADE, PRAZO E ATRIBUIÇÃO DE TAREFAS
 */
function configureTasksProperties(tasks) {
    const now = Date.now();
    const [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15, t16, t17, b1] = tasks;
    // Configurações de tarefas de DANIEL MORAES (6 tarefas)
    priorityService.setPriority(t1.id, Priority.HIGH);
    deadlineService.setDeadline(t1.id, new Date(now + 1000 * 60 * 60 * 24 * 3));
    assignmentService.assignUser(t1.id, 4);
    priorityService.setPriority(t2.id, Priority.NORMAL);
    deadlineService.setDeadline(t2.id, new Date(now + 1000 * 60 * 60 * 24 * 7));
    assignmentService.assignUser(t2.id, 5);
    priorityService.setPriority(t3.id, Priority.LOW);
    deadlineService.setDeadline(t3.id, new Date(now + 1000 * 60 * 60 * 24 * 2));
    assignmentService.assignUser(t3.id, 1);
    priorityService.setPriority(t4.id, Priority.CRITICAL);
    deadlineService.setDeadline(t4.id, new Date(now + 1000 * 60 * 60 * 24 * 5));
    assignmentService.assignUser(t4.id, 2);
    assignmentService.assignUser(t4.id, 8);
    priorityService.setPriority(t5.id, Priority.HIGH);
    deadlineService.setDeadline(t5.id, new Date(now + 1000 * 60 * 60 * 24 * 10));
    assignmentService.assignUser(t5.id, 9);
    priorityService.setPriority(t6.id, Priority.NORMAL);
    deadlineService.setDeadline(t6.id, new Date(now + 1000 * 60 * 60 * 24 * 4));
    assignmentService.assignUser(t6.id, 6);
    assignmentService.assignUser(t6.id, 11);
    // Configurações de tarefas de DANILSON (11 tarefas)
    priorityService.setPriority(t7.id, Priority.NORMAL);
    deadlineService.setDeadline(t7.id, new Date(now + 1000 * 60 * 60 * 24 * 6));
    assignmentService.assignUser(t7.id, 2);
    priorityService.setPriority(t8.id, Priority.LOW);
    deadlineService.setDeadline(t8.id, new Date(now + 1000 * 60 * 60 * 24 * 8));
    assignmentService.assignUser(t8.id, 4);
    priorityService.setPriority(t9.id, Priority.HIGH);
    deadlineService.setDeadline(t9.id, new Date(now + 1000 * 60 * 60 * 24 * 3));
    assignmentService.assignUser(t9.id, 1);
    assignmentService.assignUser(t9.id, 5);
    priorityService.setPriority(t10.id, Priority.NORMAL);
    deadlineService.setDeadline(t10.id, new Date(now + 1000 * 60 * 60 * 24 * 9));
    assignmentService.assignUser(t10.id, 2);
    priorityService.setPriority(t11.id, Priority.CRITICAL);
    deadlineService.setDeadline(t11.id, new Date(now + 1000 * 60 * 60 * 24 * 1));
    assignmentService.assignUser(t11.id, 3);
    assignmentService.assignUser(t11.id, 4);
    priorityService.setPriority(t12.id, Priority.HIGH);
    deadlineService.setDeadline(t12.id, new Date(now + 1000 * 60 * 60 * 24 * 5));
    assignmentService.assignUser(t12.id, 1);
    priorityService.setPriority(t13.id, Priority.NORMAL);
    deadlineService.setDeadline(t13.id, new Date(now + 1000 * 60 * 60 * 24 * 10));
    assignmentService.assignUser(t13.id, 6);
    priorityService.setPriority(t14.id, Priority.LOW);
    deadlineService.setDeadline(t14.id, new Date(now + 1000 * 60 * 60 * 24 * 7));
    assignmentService.assignUser(t14.id, 9);
    assignmentService.assignUser(t14.id, 11);
    priorityService.setPriority(t15.id, Priority.CRITICAL);
    deadlineService.setDeadline(t15.id, new Date(now + 1000 * 60 * 60 * 24 * 2));
    assignmentService.assignUser(t15.id, 8);
    priorityService.setPriority(t16.id, Priority.HIGH);
    deadlineService.setDeadline(t16.id, new Date(now + 1000 * 60 * 60 * 24 * 4));
    assignmentService.assignUser(t16.id, 5);
    priorityService.setPriority(t17.id, Priority.NORMAL);
    deadlineService.setDeadline(t17.id, new Date(now + 1000 * 60 * 60 * 24 * 11));
    assignmentService.assignUser(t17.id, 2);
    assignmentService.assignUser(t17.id, 10);
    // Bug task
    priorityService.setPriority(b1.id, Priority.CRITICAL);
    assignmentService.assignUser(b1.id, 1);
}
/**
 * Retorna uma mensagem condicional baseada no número de tarefas de um usuário
 * @param taskCount - Número total de tarefas do usuário
 * @returns Objeto com mensagem e status para estilos CSS
 */
export function getTaskUrgencyMessage(taskCount) {
    if (taskCount === 0) {
        return { message: "Sem tarefas atribuídas", status: "empty" };
    }
    else if (taskCount <= 5) {
        return { message: "Carga de trabalho controlada", status: "low" };
    }
    else if (taskCount <= 10) {
        return { message: "⚠️ Carga aumentada - acompanhar", status: "medium" };
    }
    else {
        return { message: "🔴 URGENTE - Muitas tarefas pendentes!", status: "high" };
    }
}
/**
 * Conta o número de tarefas de um usuário específico
 * @param userId - ID do usuário
 * @returns Número total de tarefas (próprias + atribuídas)
 */
export function countUserTasks(userId) {
    return listTasks.filter(t => {
        const isOwner = t.userId === userId;
        return isOwner;
    }).length;
}
export function createFakeTasksIfEmpty() {
    if (listTasks.length > 0)
        return;
    const tasks = createFakeTasks();
    listTasks.push(...tasks);
    configureTasksProperties(tasks);
    SystemLogger.log("[TaskService] Tarefas fictícias criadas com sucesso.");
}
