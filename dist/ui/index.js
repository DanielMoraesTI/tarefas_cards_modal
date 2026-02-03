export * from './renderUser.js';
export * from './renderTask.js';
export * from './modals.js';
export * from './eventHandlers.js';
export * from './systemUI.js';
export * from './viewToggle.js';
import { Task } from '../models/task.js';
import { BugTask } from '../tasks/BugTask.js';
import { BaseEntity } from '../models/BaseEntity.js';
export function renderDashboard() {
    const dashboard = document.getElementById("stats-dashboard");
    if (!dashboard)
        return;
    const stats = Task.getCategoryStats();
    const totalBugs = BugTask.getBugCount();
    const totalGlobal = BaseEntity.getTotalEntities();
    dashboard.innerHTML = `
        <div class="counter-block">
            <span class="num" style="color: #3498db;">${totalGlobal}</span>
            <span class="label">Total</span>
        </div>
        <div class="counter-block">
            <span class="num" style="color: #e74c3c;">${totalBugs}</span>
            <span class="label">Bugs</span>
        </div>
        <div class="counter-block">
            <span class="num">${stats["Audiência"] || 0}</span>
            <span class="label">Audiência</span>
        </div>
        <div class="counter-block">
            <span class="num">${stats["Atendimento"] || 0}</span>
            <span class="label">Atend.</span>
        </div>
    `;
}
