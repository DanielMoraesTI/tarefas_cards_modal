import { listTasks, setListTasks } from '../services/taskService.js';
import { selectedUserId } from '../services/userService.js';
import { renderUsers } from './renderUser.js';
const taskListUI = document.getElementById("taskList");
export function renderTasks(arrayToRender) {
    taskListUI.innerHTML = "";
    if (selectedUserId === null) {
        taskListUI.innerHTML = "<li>Selecione um utilizador à esquerda</li>";
        return;
    }
    const tasksToShow = arrayToRender || listTasks.filter(t => t.userId === selectedUserId);
    tasksToShow.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        let completionDateHtml = "";
        if (task.completed && task.concludedAt) {
            const d = new Date(task.concludedAt);
            const dataFormatada = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
            completionDateHtml = `<br><small style="color: #666;">Concluída em: ${dataFormatada}</small>`;
        }
        li.innerHTML = `
            <div style="task-content" ${task.completed ? 'text-decoration: line-through; opacity: 0.6' : ''}">
                <span class="badge-cat">${task.category}</span>
                <span class="badge-sub">${task.subject}</span>
                <span class="task-title">${task.title}</span>
                ${completionDateHtml}
            </div>
            <div class="task-btns">
                <button class="btnEdit">Editar</button>
                <button class="btnDone">${task.completed ? 'Reabrir' : 'Concluída'}</button>
                <button class="btnDelTask">Fechar</button>
            </div>
        `;
        li.querySelector(".btnEdit")?.addEventListener("click", () => window.openEditModal(task.id));
        li.querySelector(".btnDone")?.addEventListener("click", () => {
            task.completed = !task.completed;
            task.concludedAt = task.completed ? new Date() : undefined;
            renderTasks();
            renderUsers();
        });
        li.querySelector(".btnDelTask")?.addEventListener("click", () => {
            setListTasks(listTasks.filter(t => t.id !== task.id));
            renderTasks();
            renderUsers();
        });
        taskListUI.appendChild(li);
    });
}
