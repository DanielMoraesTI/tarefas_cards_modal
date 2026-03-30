/**
 * API Service para Tarefas
 * Abstração das chamadas HTTP para o backend Node.js/Express
 * Backend: http://localhost:3000
 */
const BASE_URL = 'http://localhost:3000';
/**
 * Função para obter todas as tarefas
 * @param search - Buscar tarefas por título (opcional)
 * @param sort - Ordenar por 'asc' ou 'desc' (opcional)
 */
async function getAllTasks(search = '', sort = '') {
    try {
        const params = new URLSearchParams();
        if (search)
            params.append('search', search);
        if (sort)
            params.append('sort', sort);
        const query = params.toString() ? `?${params.toString()}` : '';
        const url = `${BASE_URL}/tasks${query}`;
        const res = await fetch(url);
        if (!res.ok)
            throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
        const data = await res.json();
        // Verificar se as tarefas já vêm com tags
        if (Array.isArray(data) && data.length > 0) {
            if (!data[0].tags || !Array.isArray(data[0].tags)) {
                console.warn('[apiTaskService] Backend NÃO retorna tags – serão carregadas via fallback');
            }
        }
        return data;
    }
    catch (error) {
        console.error('[apiTaskService] Erro ao buscar tarefas:', error);
        return null;
    }
}
/**
 * Função para obter uma tarefa específica por ID
 * @param id - ID da tarefa
 */
async function getTaskById(id) {
    try {
        const res = await fetch(`${BASE_URL}/tasks/${id}`);
        if (!res.ok)
            throw new Error("Erro: " + res.status);
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
/**
 * Função para criar uma nova tarefa
 * @param task - Objeto com dados da tarefa (title, categoria, user_id, responsavelNome, dataConclusao)
 */
async function createTask(task) {
    try {
        const res = await fetch(`${BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!res.ok)
            throw new Error("Erro: " + res.status);
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
/**
 * Função para atualizar uma tarefa existente
 * @param id - ID da tarefa
 * @param task - Objeto com dados a atualizar (title, categoria, concluida, user_id, dataConclusao)
 */
async function updateTask(id, task) {
    try {
        const res = await fetch(`${BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (!res.ok)
            throw new Error("Erro: " + res.status);
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
/**
 * Função para deletar uma tarefa
 * @param id - ID da tarefa a deletar
 */
async function deleteTask(id) {
    try {
        const res = await fetch(`${BASE_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok)
            throw new Error("Erro: " + res.status);
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
/**
 * Função para obter estatísticas das tarefas
 */
async function getTaskStats() {
    try {
        const res = await fetch(`${BASE_URL}/tasks/stats`);
        if (!res.ok)
            throw new Error("Erro: " + res.status);
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
/**
 * Função para obter todas as tags associadas a uma tarefa
 * @param taskId - ID da tarefa
 */
async function getTaskTags(taskId) {
    try {
        const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags`);
        if (!res.ok)
            throw new Error("Erro: " + res.status);
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
/**
 * Função para adicionar uma tag a uma tarefa
 * @param taskId - ID da tarefa
 * @param tagId - ID da tag
 */
async function addTagToTask(taskId, tagId) {
    try {
        const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags/${tagId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok)
            throw new Error("Erro: " + res.status);
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export const apiTaskService = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
    getTaskTags,
    addTagToTask
};
