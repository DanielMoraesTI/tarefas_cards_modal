import { Task } from '../models/task.js';
import { Priority } from '../tasks/Priority.js';
import { priorityService } from './PriorityService.js';
import { SystemLogger } from '../logs/SystemLogger.js';
import { apiTaskService } from '../api/apiTaskService.js';
import { apiTagService } from '../api/apiTagService.js';
export let listTasks = [];
export const setListTasks = (newList) => {
    listTasks.splice(0, listTasks.length, ...newList);
};
/**
 * Carrega dados iniciais de tarefas do backend via API
 * Converte os dados do backend para instâncias de Task
 * Nota: As tags já vêm com as tarefas do backend
 */
export async function loadInitialTasksData() {
    try {
        listTasks.splice(0, listTasks.length);
        // Buscar tarefas do backend
        const tasks = await apiTaskService.getAllTasks();
        // Verificar se recebeu resposta válida
        if (!tasks) {
            console.warn('[TaskService] Backend retornou null/undefined');
            return;
        }
        // Converter dados do backend para instâncias de Task
        if (Array.isArray(tasks)) {
            tasks.forEach((taskData) => {
                // Mapear categoria do backend para workCategoria válida
                const workCat = ['Audiência', 'Atendimento', 'Análise'].includes(taskData.categoria)
                    ? taskData.categoria
                    : 'Audiência';
                // Criar instância de Task com os dados do backend
                const newTask = new Task(taskData.title, taskData.user_id || 0, workCat, 'Civil', // Padrão para subjectCategoria
                taskData.id);
                // Se a tarefa está concluída, marcar como tal
                if (taskData.concluida) {
                    newTask.completed = true;
                    newTask.completionDate = taskData.dataConclusao;
                }
                // Armazenar dados adicionais
                newTask.responsavelNome = taskData.responsavelNome;
                newTask.dataConclusao = taskData.dataConclusao;
                // ✅ O backend já retorna tags com cada tarefa - IMPORTANTE: Deep copy para evitar compartilhamento
                if (Array.isArray(taskData.tags) && taskData.tags.length > 0) {
                    newTask.tags = taskData.tags.map((t) => ({
                        id: t.id,
                        name: t.name,
                        color: t.color || '#9b59b6'
                    }));
                }
                else {
                    newTask.tags = [];
                }
                listTasks.push(newTask);
            });
        }
    }
    catch (error) {
        console.error('[TaskService] Erro ao carregar tarefas:', error);
    }
}
/**
 * FALLBACK: Carrega tags via /tasks/:id/tags para TODAS as tarefas
 * ⚠️ CRÍTICO: GET /tasks NÃO retorna tags, então sempre carregar separadamente
 */
export async function loadTasksTagsFallback() {
    try {
        if (listTasks.length === 0)
            return;
        // Carregar tags de TODAS as tarefas em paralelo
        const tagPromises = listTasks.map(async (task) => {
            try {
                const tags = await apiTagService.getTagsByTask(task.id);
                task.tags = Array.isArray(tags) && tags.length > 0
                    ? tags.map((t) => ({
                        id: t.id,
                        name: t.name,
                        color: t.color || '#9b59b6'
                    }))
                    : [];
            }
            catch (error) {
                task.tags = [];
            }
        });
        await Promise.all(tagPromises);
    }
    catch (error) {
        console.error('[TaskService] Erro ao carregar tags:', error);
    }
}
/**
 * Recarrega tags de TODAS as tarefas quando muda de usuário
 */
export async function reloadAllTagsForUser(userId) {
    try {
        const tagPromises = listTasks.map(async (task) => {
            try {
                const tags = await apiTagService.getTagsByTask(task.id);
                task.tags = Array.isArray(tags) && tags.length > 0
                    ? tags.map((t) => ({
                        id: t.id,
                        name: t.name,
                        color: t.color || '#9b59b6'
                    }))
                    : [];
            }
            catch (error) {
                task.tags = [];
            }
        });
        await Promise.all(tagPromises);
    }
    catch (error) {
        console.error('[TaskService] Erro ao recarregar tags:', error);
    }
}
/**
 * Recarrega uma tarefa específica do backend e sincroniza suas tags
 * Usada após adicionar/remover tags para garantir sincronização correta
 * @param taskId - ID da tarefa a recarregar
 */
export async function reloadTaskById(taskId) {
    try {
        // Encontrar tarefa local
        const localTask = listTasks.find(t => t.id === taskId);
        if (!localTask) {
            return;
        }
        // Buscar tarefa do backend
        const taskData = await apiTaskService.getTaskById(taskId);
        if (!taskData) {
            return;
        }
        // Atualizar campos da tarefa
        localTask.title = taskData.title;
        localTask.responsavelNome = taskData.responsavelNome;
        localTask.dataConclusao = taskData.dataConclusao;
        // Backend não retorna tags em getTaskById, então deixar como está
        // Tags serão recarregadas via reloadAllTagsForUser()
    }
    catch (error) {
        console.error('[taskService] Erro ao recarregar tarefa:', error);
    }
}
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
/**
 * Cria uma nova tarefa via backend
 * @param title - Título da tarefa
 * @param categoria - Categoria da tarefa
 * @param user_id - ID do usuário responsável
 */
export async function createTaskBackend(title, categoria = 'Geral', user_id) {
    try {
        if (!title.trim()) {
            throw new Error('Título da tarefa é obrigatório');
        }
        const taskData = {
            title,
            categoria,
            user_id: user_id || null,
            concluida: false
        };
        const newTask = await apiTaskService.createTask(taskData);
        if (!newTask) {
            throw new Error('Falha ao criar tarefa no backend');
        }
        // Mapear categoria do backend para workCategoria válida
        const workCat = ['Audiência', 'Atendimento', 'Análise'].includes(newTask.categoria)
            ? newTask.categoria
            : 'Audiência';
        // Converter dados do backend para instância de Task e adicionar à lista
        const task = new Task(newTask.title, newTask.user_id || 0, workCat, 'Civil', newTask.id);
        task.responsavelNome = newTask.responsavelNome;
        task.dataConclusao = newTask.dataConclusao;
        listTasks.push(task);
        SystemLogger.log(`[TaskService] Tarefa criada: ${title}`);
        return newTask;
    }
    catch (error) {
        console.error('[TaskService] Erro ao criar tarefa:', error);
        throw error;
    }
}
/**
 * Atualiza uma tarefa existente via backend
 * @param id - ID da tarefa
 * @param updates - Objeto com campos a atualizar
 */
export async function updateTaskBackend(id, updates) {
    try {
        const updated = await apiTaskService.updateTask(id, updates);
        if (!updated) {
            throw new Error('Falha ao atualizar tarefa no backend');
        }
        // Encontrar e atualizar a tarefa na lista
        const taskIndex = listTasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            const task = listTasks[taskIndex];
            // Atualizar propriedades
            if (updates.title)
                task.title = updates.title;
            if (updates.categoria)
                task.categoria = updates.categoria;
            if (updates.concluida !== undefined)
                task.completed = updates.concluida;
            if (updates.dataConclusao !== undefined)
                task.dataConclusao = updates.dataConclusao;
            if (updates.responsavelNome !== undefined)
                task.responsavelNome = updates.responsavelNome;
            if (updates.user_id !== undefined)
                task.userId = updates.user_id;
        }
        SystemLogger.log(`[TaskService] Tarefa ${id} atualizada`);
    }
    catch (error) {
        console.error('[TaskService] Erro ao atualizar tarefa:', error);
        throw error;
    }
}
/**
 * Remove uma tarefa via backend
 * @param id - ID da tarefa a remover
 */
export async function deleteTaskLogic(id) {
    try {
        const deleted = await apiTaskService.deleteTask(id);
        if (!deleted) {
            throw new Error('Falha ao deletar tarefa no backend');
        }
        // Remover da lista
        const filtered = listTasks.filter(t => t.id !== id);
        setListTasks(filtered);
        SystemLogger.log(`[TaskService] Tarefa ${id} deletada`);
    }
    catch (error) {
        console.error('[TaskService] Erro ao deletar tarefa:', error);
        throw error;
    }
}
