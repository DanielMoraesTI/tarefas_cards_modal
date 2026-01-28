import { listTasks } from './index.js';
export class StatisticsService {
    /**
     * Conta o número total de tarefas
     */
    static countTasks() {
        return listTasks.length;
    }
    /**
     * Conta o número de tarefas concluídas
     */
    static countCompletedTasks() {
        return listTasks.filter(t => t.completed).length;
    }
    /**
     * Retorna percentual de tarefas concluídas (0-100)
     */
    static getCompletionPercentage() {
        const total = this.countTasks();
        if (total === 0)
            return 0;
        return Math.round((this.countCompletedTasks() / total) * 100);
    }
}
export default StatisticsService;
