import { BaseEntity } from './BaseEntity.js';
import { TaskStatus } from '../tasks/TaskStatus.js';
import { BusinessRules } from '../services/BusinessRules.js';
import { SystemLogger } from '../logs/SystemLogger.js';
export class Task extends BaseEntity {
    title;
    userId;
    category;
    subject;
    completed = false;
    status = TaskStatus.CREATED;
    concludedAt;
    // 1. Dicionário Estático para contagem por categoria
    static categoryStats = {
        "Audiência": 0,
        "Atendimento": 0,
        "Análise": 0,
        "Outros": 0
    };
    constructor(title, userId, category, subject, id) {
        super(id);
        this.title = title;
        this.userId = userId;
        this.category = category;
        this.subject = subject;
        // 2. Incremento dinâmico baseado na categoria recebida
        this.incrementCategoryCount(category);
    }
    /**
     * Incrementa o contador da categoria específica com segurança.
     */
    incrementCategoryCount(cat) {
        if (Task.categoryStats[cat] !== undefined) {
            Task.categoryStats[cat]++;
        }
        else {
            Task.categoryStats["Outros"]++;
        }
        SystemLogger.log(`[Stats] Categoria "${cat}" incrementada. Total: ${Task.categoryStats[cat] || Task.categoryStats["Outros"]}`);
    }
    /**
     * Retorna o snapshot atual das estatísticas de categorias.
     */
    static getCategoryStats() {
        return { ...Task.categoryStats };
    }
    getType() {
        return "Tarefa Geral";
    }
    moveTo(newStatus) {
        if (newStatus === TaskStatus.COMPLETED) {
            const isBlocked = this.status === TaskStatus.BLOCKED;
            if (!BusinessRules.canTaskBeCompleted(isBlocked))
                return;
        }
        this.status = newStatus;
        if (newStatus === TaskStatus.COMPLETED) {
            this.completed = true;
            this.concludedAt = new Date();
            SystemLogger.log(`[Task] Tarefa #${this.id} concluída.`);
        }
        else {
            this.completed = false;
            this.concludedAt = undefined;
        }
    }
}
