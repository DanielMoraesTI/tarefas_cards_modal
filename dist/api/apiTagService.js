/**
 * API Service para Tags
 * Abstração das chamadas HTTP para o backend Node.js/Express
 * Backend: http://localhost:3000
 */
const BASE_URL = 'http://localhost:3000';
/**
 * Função para obter todas as tags
 * @param search - Buscar tags por nome (opcional)
 * @param sort - Ordenar por 'asc' ou 'desc' (opcional)
 */
async function getAllTags(search = '', sort = '') {
    try {
        const params = new URLSearchParams();
        if (search)
            params.append('search', search);
        if (sort)
            params.append('sort', sort);
        const query = params.toString() ? `?${params.toString()}` : '';
        const res = await fetch(`${BASE_URL}/tags${query}`);
        if (!res.ok)
            throw new Error("Erro: " + res.status);
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
/**
 * Função para obter uma tag específica por ID
 * @param id - ID da tag
 */
async function getTagById(id) {
    try {
        const res = await fetch(`${BASE_URL}/tags/${id}`);
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
 * Função para criar uma nova tag
 * @param tag - Objeto com dados da tag (name, color?)
 */
async function createTag(tag) {
    try {
        const res = await fetch(`${BASE_URL}/tags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tag)
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
 * Função para deletar uma tag
 * @param id - ID da tag a deletar
 */
async function deleteTag(id) {
    try {
        const res = await fetch(`${BASE_URL}/tags/${id}`, {
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
 * Função para obter todas as tarefas associadas a uma tag
 * @param tagId - ID da tag
 */
async function getTasksByTag(tagId) {
    try {
        const res = await fetch(`${BASE_URL}/tags/${tagId}/tasks`);
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
 * Função para obter todas as tags de uma tarefa específica
 * @param taskId - ID da tarefa
 */
async function getTagsByTask(taskId) {
    try {
        const url = `${BASE_URL}/tasks/${taskId}/tags`;
        const res = await fetch(url);
        if (!res.ok)
            throw new Error(`Erro: ${res.status}`);
        const data = await res.json();
        // Se for objeto vazio {}, retornar array vazio
        if (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0) {
            return [];
        }
        return data;
    }
    catch (error) {
        console.error(`[apiTagService.getTagsByTask] Erro ao carregar tags da tarefa ${taskId}:`, error);
        return [];
    }
}
/**
 * Função para adicionar uma tag a uma tarefa
 * @param taskId - ID da tarefa
 * @param tagId - ID da tag
 */
async function addTagToTask(taskId, tagId) {
    try {
        const res = await fetch(`${BASE_URL}/tasks/${taskId}/tags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tagId })
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
export const apiTagService = {
    getAllTags,
    getTagById,
    createTag,
    deleteTag,
    getTasksByTag,
    getTagsByTask,
    addTagToTask
};
