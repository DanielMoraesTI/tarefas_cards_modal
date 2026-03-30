import { ITask } from '../tasks/ITask.js';
import { Task } from '../models/task.js';
import { BugTask } from '../tasks/BugTask.js';
import { Priority } from '../tasks/Priority.js';
import { priorityService } from './PriorityService.js';
import { deadlineService } from './DeadlineService.js';
import { assignmentService } from './AssignmentService.js';
import { SystemLogger } from '../logs/SystemLogger.js';
import { apiTaskService } from '../api/apiTaskService.js';
import { apiTagService } from '../api/apiTagService.js';

export let listTasks: ITask[] = [];

export const setListTasks = (newList: ITask[]) => {
    listTasks.splice(0, listTasks.length, ...newList);
};

/**
 * Carrega dados iniciais de tarefas do backend via API
 * Converte os dados do backend para instâncias de Task
 * Nota: As tags já vêm com as tarefas do backend
 */
export async function loadInitialTasksData(): Promise<void> {
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
            tasks.forEach((taskData: any) => {
                // Mapear categoria do backend para workCategoria válida
                const workCat = ['Audiência', 'Atendimento', 'Análise'].includes(taskData.categoria) 
                    ? taskData.categoria 
                    : 'Audiência';
                
                // Criar instância de Task com os dados do backend
                const newTask = new Task(
                    taskData.title,
                    taskData.user_id || 0,
                    workCat as any,
                    'Civil' as any, // Padrão para subjectCategoria
                    taskData.id
                );
                
                // Se a tarefa está concluída, marcar como tal
                if (taskData.concluida) {
                    (newTask as any).completed = true;
                    (newTask as any).completionDate = taskData.dataConclusao;
                }
                
                // Armazenar dados adicionais
                (newTask as any).responsavelNome = taskData.responsavelNome;
                (newTask as any).dataConclusao = taskData.dataConclusao;
                
                // O backend já retorna tags com cada tarefa - IMPORTANTE: Deep copy para evitar compartilhamento
                if (Array.isArray(taskData.tags) && taskData.tags.length > 0) {
                    (newTask as any).tags = taskData.tags.map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        color: t.color || '#9b59b6'
                    }));
                } else {
                    (newTask as any).tags = [];
                }
                
                listTasks.push(newTask);
            });
        }
    } catch (error) {
        console.error('[TaskService] Erro ao carregar tarefas:', error);
    }
}

/**
 * Carrega tags via /tasks/:id/tags para TODAS as tarefas
 */
export async function loadTasksTagsFallback(): Promise<void> {
    try {
        if (listTasks.length === 0) return;
        
        // Carregar tags de TODAS as tarefas em paralelo
        const tagPromises = listTasks.map(async (task: any) => {
            try {
                const tags = await apiTagService.getTagsByTask(task.id);
                
                task.tags = Array.isArray(tags) && tags.length > 0
                    ? tags.map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        color: t.color || '#9b59b6'
                    }))
                    : [];
            } catch (error) {
                task.tags = [];
            }
        });
        
        await Promise.all(tagPromises);
    } catch (error) {
        console.error('[TaskService] Erro ao carregar tags:', error);
    }
}

/**
 * Recarrega tags de TODAS as tarefas quando muda de usuário
 */
export async function reloadAllTagsForUser(userId: number): Promise<void> {
    try {
        const tagPromises = listTasks.map(async (task: any) => {
            try {
                const tags = await apiTagService.getTagsByTask(task.id);
                task.tags = Array.isArray(tags) && tags.length > 0 
                    ? tags.map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        color: t.color || '#9b59b6'
                    }))
                    : [];
            } catch (error) {
                task.tags = [];
            }
        });
        
        await Promise.all(tagPromises);
    } catch (error) {
        console.error('[TaskService] Erro ao recarregar tags:', error);
    }
}

/**
 * Recarrega uma tarefa específica do backend e sincroniza suas tags
 * Usada após adicionar/remover tags para garantir sincronização correta
 * @param taskId - ID da tarefa a recarregar
 */
export async function reloadTaskById(taskId: number): Promise<void> {
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
        (localTask as any).title = taskData.title;
        (localTask as any).responsavelNome = taskData.responsavelNome;
        (localTask as any).dataConclusao = taskData.dataConclusao;
        
        // Backend não retorna tags em getTaskById, então deixar como está
        // Tags serão recarregadas via reloadAllTagsForUser()
    } catch (error) {
        console.error('[taskService] Erro ao recarregar tarefa:', error);
    }
}

export function removeTasksByUserId(userId: number): void {
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
export function getTaskUrgencyMessage(taskCount: number): { message: string; status: string } {
    if (taskCount === 0) {
        return { message: "Sem tarefas atribuídas", status: "empty" };
    } else if (taskCount <= 5) {
        return { message: "Carga de trabalho controlada", status: "low" };
    } else if (taskCount <= 10) {
        return { message: "⚠️ Carga aumentada - acompanhar", status: "medium" };
    } else {
        return { message: "🔴 URGENTE - Muitas tarefas pendentes!", status: "high" };
    }
}

/**
 * Conta o número de tarefas de um usuário específico
 * @param userId - ID do usuário
 * @returns Número total de tarefas (próprias + atribuídas)
 */
export function countUserTasks(userId: number): number {
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
export async function createTaskBackend(
    title: string,
    categoria: string = 'Geral',
    user_id?: number
): Promise<any> {
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
        const task = new Task(
            newTask.title,
            newTask.user_id || 0,
            workCat as any,
            'Civil' as any,
            newTask.id
        );

        (task as any).responsavelNome = newTask.responsavelNome;
        (task as any).dataConclusao = newTask.dataConclusao;

        listTasks.push(task);
        
        SystemLogger.log(`[TaskService] Tarefa criada: ${title}`);
        return newTask;
    } catch (error) {
        console.error('[TaskService] Erro ao criar tarefa:', error);
        throw error;
    }
}

/**
 * Atualiza uma tarefa existente via backend
 * @param id - ID da tarefa
 * @param updates - Objeto com campos a atualizar
 */
export async function updateTaskBackend(id: number, updates: any): Promise<void> {
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
            if (updates.title) (task as any).title = updates.title;
            if (updates.categoria) (task as any).categoria = updates.categoria;
            if (updates.concluida !== undefined) (task as any).completed = updates.concluida;
            if (updates.dataConclusao !== undefined) (task as any).dataConclusao = updates.dataConclusao;
            if (updates.responsavelNome !== undefined) (task as any).responsavelNome = updates.responsavelNome;
            if (updates.user_id !== undefined) (task as any).userId = updates.user_id;
        }
        
        SystemLogger.log(`[TaskService] Tarefa ${id} atualizada`);
    } catch (error) {
        console.error('[TaskService] Erro ao atualizar tarefa:', error);
        throw error;
    }
}

/**
 * Remove uma tarefa via backend
 * @param id - ID da tarefa a remover
 */
export async function deleteTaskLogic(id: number): Promise<void> {
    try {
        const deleted = await apiTaskService.deleteTask(id);
        
        if (!deleted) {
            throw new Error('Falha ao deletar tarefa no backend');
        }

        // Remover da lista
        const filtered = listTasks.filter(t => t.id !== id);
        setListTasks(filtered);
        
        SystemLogger.log(`[TaskService] Tarefa ${id} deletada`);
    } catch (error) {
        console.error('[TaskService] Erro ao deletar tarefa:', error);
        throw error;
    }
}