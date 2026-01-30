import { BaseEntity } from './BaseEntity.js';
import { ITask } from '../tasks/ITask.js';
import { TaskStatus } from '../tasks/TaskStatus.js';
import { workCategoria, subjectCategoria } from '../utils/utilTypes.js';
import { BusinessRules } from '../services/BusinessRules.js';
import { SystemLogger } from '../logs/SystemLogger.js';

export class Task extends BaseEntity implements ITask {
    public completed: boolean = false;
    public status: TaskStatus = TaskStatus.CREATED; 
    public concludedAt?: Date;

    // 1. Dicionário Estático para contagem por categoria
    private static categoryStats: Record<string, number> = {
        "Audiência": 0,
        "Atendimento": 0,
        "Análise": 0,
        "Outros": 0
    };

    constructor(
        public title: string,
        public userId: number,
        public category: workCategoria,
        public subject: subjectCategoria,
        id?: number
    ) {
        super(id);
        
        // 2. Incremento dinâmico baseado na categoria recebida
        this.incrementCategoryCount(category);
    }

    /**
     * Incrementa o contador da categoria específica com segurança.
     */
    private incrementCategoryCount(cat: string): void {
        if (Task.categoryStats[cat] !== undefined) {
            Task.categoryStats[cat]++;
        } else {
            Task.categoryStats["Outros"]++;
        }
        
        SystemLogger.log(`[Stats] Categoria "${cat}" incrementada. Total: ${Task.categoryStats[cat] || Task.categoryStats["Outros"]}`);
    }

    /**
     * Retorna o snapshot atual das estatísticas de categorias.
     */
    public static getCategoryStats() {
        return { ...Task.categoryStats };
    }

    public getType(): string {
        return "Tarefa Geral";
    }

    public moveTo(newStatus: TaskStatus): void {
        if (newStatus === TaskStatus.COMPLETED) {
            const isBlocked = this.status === TaskStatus.BLOCKED;
            if (!BusinessRules.canTaskBeCompleted(isBlocked)) return;
        }

        this.status = newStatus;
        
        if (newStatus === TaskStatus.COMPLETED) {
            this.completed = true;
            this.concludedAt = new Date();
            SystemLogger.log(`[Task] Tarefa #${this.id} concluída.`);
        } else {
            this.completed = false;
            this.concludedAt = undefined;
        }
    }
}





