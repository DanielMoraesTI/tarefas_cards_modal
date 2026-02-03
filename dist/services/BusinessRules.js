import { SystemLogger } from '../logs/SystemLogger.js';
/**
 * Classe de Regras de Negócio Globais.
 * Centraliza as validações e regista violações de regras no SystemLogger.
 */
export class BusinessRules {
    /**
     * Regra: Um utilizador só pode ser desativado se não tiver tarefas ativas.
     */
    static canUserBeDeactivated(activeTasks) {
        const canDeactivate = activeTasks === 0;
        if (!canDeactivate) {
            SystemLogger.log(`[Regra Negócio] Bloqueio de Inativação: Utilizador possui ${activeTasks} tarefas pendentes.`);
        }
        return canDeactivate;
    }
    /**
     * Regra: Tarefas bloqueadas (ex: expiradas) não podem ser concluídas.
     */
    static canTaskBeCompleted(isBlocked) {
        const canComplete = !isBlocked;
        if (!canComplete) {
            SystemLogger.log(`[Regra Negócio] Bloqueio de Conclusão: A tarefa está marcada como BLOCKED.`);
        }
        return canComplete;
    }
    /**
     * Regra: Apenas utilizadores ativos podem receber atribuições.
     */
    static canAssignTask(active) {
        const canAssign = active === true;
        if (!canAssign) {
            SystemLogger.log(`[Regra Negócio] Bloqueio de Atribuição: O utilizador não está ativo no sistema.`);
        }
        return canAssign;
    }
    static isValidTitle(title) {
        const valid = title.trim().length >= 3;
        if (!valid) {
            SystemLogger.log(`[Regra Negócio] Validação de Título: "${title}" é demasiado curto ou inválido.`);
        }
        return valid;
    }
}
