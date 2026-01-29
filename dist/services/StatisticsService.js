import { listTasks } from './index.js';
// Serviço para estatísticas relacionadas às tarefas
export class StatisticsService {
    static countTasks() {
        return listTasks.length;
    }
    static countCompletedTasks() {
        return listTasks.filter(t => t.completed).length;
    }
    static getCompletionPercentage() {
        const total = this.countTasks();
        if (total === 0)
            return 0;
        return Math.round((this.countCompletedTasks() / total) * 100);
    }
}
export default StatisticsService;
