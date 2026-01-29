import { listTasks } from './index.js';
export class StatisticsService {

  static countTasks(): number {
    return listTasks.length;
  }

  static countCompletedTasks(): number {
    return listTasks.filter(t => t.completed).length;
  }

  static getCompletionPercentage(): number {
    const total = this.countTasks();
    if (total === 0) return 0;
    return Math.round((this.countCompletedTasks() / total) * 100);
  }
}

export default StatisticsService;
