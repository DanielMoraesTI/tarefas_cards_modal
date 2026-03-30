/**
 * Tag Service
 * Gerencia tags de tarefas via integração com backend (apiTagService)
 * Padrão simples e direto, sem cache, chamando o backend em cada operação
 */
import { apiTagService } from '../api/apiTagService.js';
import { SystemLogger } from '../logs/SystemLogger.js';
/**
 * TagService - Gerencia tags com integração ao backend
 * Simplifique e direto, sem complexidade de cache
 */
export class TagService {
    /**
     * Obtém todas as tags de uma tarefa
     * @param taskId - ID da tarefa
     * @returns Array de tags da tarefa
     */
    async getTags(taskId) {
        try {
            const tags = await apiTagService.getTasksByTag(taskId);
            return tags || [];
        }
        catch (error) {
            console.error(`[TagService] Erro ao obter tags da tarefa ${taskId}:`, error);
            return [];
        }
    }
    /**
     * Obtém todas as tags disponíveis
     * @returns Array com todas as tags
     */
    async getAllTags() {
        try {
            const tags = await apiTagService.getAllTags();
            return tags || [];
        }
        catch (error) {
            console.error('[TagService] Erro ao obter todas as tags:', error);
            return [];
        }
    }
    /**
     * Cria uma nova tag
     * @param name - Nome da tag
     * @param color - Cor da tag em formato hex (opcional)
     * @returns Tag criada
     */
    async createTag(name, color = '#9b59b6') {
        try {
            if (!name || name.trim().length === 0) {
                throw new Error('Nome da tag é obrigatório');
            }
            const newTag = await apiTagService.createTag({ name: name.trim(), color });
            SystemLogger.log(`[TagService] Tag criada: ${newTag.name} (ID: ${newTag.id})`);
            return newTag;
        }
        catch (error) {
            console.error('[TagService] Erro ao criar tag:', error);
            throw error;
        }
    }
    /**
     * Adiciona uma tag a uma tarefa
     * @param taskId - ID da tarefa
     * @param tagId - ID da tag
     */
    async addTag(taskId, tagId) {
        try {
            await apiTagService.addTagToTask(taskId, tagId);
            SystemLogger.log(`[TagService] Tag ${tagId} adicionada à tarefa ${taskId}`);
        }
        catch (error) {
            console.error(`[TagService] Erro ao adicionar tag ${tagId} à tarefa ${taskId}:`, error);
            throw error;
        }
    }
    /**
     * Deleta uma tag
     * @param tagId - ID da tag a deletar
     */
    async deleteTag(tagId) {
        try {
            await apiTagService.deleteTag(tagId);
            SystemLogger.log(`[TagService] Tag ${tagId} deletada com sucesso`);
        }
        catch (error) {
            console.error(`[TagService] Erro ao deletar tag ${tagId}:`, error);
            throw error;
        }
    }
    /**
     * Obtém tarefas associadas a uma tag
     * @param tagId - ID da tag
     * @returns Array de tarefas da tag
     */
    async getTasksByTag(tagId) {
        try {
            const tasks = await apiTagService.getTasksByTag(tagId);
            return tasks || [];
        }
        catch (error) {
            console.error(`[TagService] Erro ao obter tarefas da tag ${tagId}:`, error);
            return [];
        }
    }
}
