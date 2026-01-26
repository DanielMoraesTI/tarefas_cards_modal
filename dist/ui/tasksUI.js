import { listTasks, selectedUserId } from '../state/state.js';
export function renderTasks(arrayToRender = listTasks) {
    const taskListUI = document.getElementById("taskList");
    taskListUI.innerHTML = "";
    if (!selectedUserId) {
        taskListUI.innerHTML = "<li>Selecione um utilizador à esquerda</li>";
        return;
    }
    const tasksToShow = arrayToRender.filter(t => t.userId === selectedUserId);
    // CORPO 100% igual ao main.ts
}
