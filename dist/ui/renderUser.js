import { listUsers, selectedUserId, toggleUserStatus, removeUserLogic, setSelectedUserId } from '../services/index.js';
import { listTasks, removeTasksByUserId } from '../services/taskService.js';
import { renderTasks } from './renderTask.js';
const usersListUI = document.getElementById("usersList");
const selectedUserNameUI = document.getElementById("selectedUserName");
export function renderUsers(arrayToRender = listUsers) {
    usersListUI.innerHTML = "";
    const totalUsers = listUsers.length;
    const totalActive = listUsers.filter(u => u.active).length;
    const activityPercentage = totalUsers > 0 ? Math.round((totalActive / totalUsers) * 100) : 0;
    const elements = {
        uCount: document.getElementById("userCount"),
        aCount: document.getElementById("activeCount"),
        iCount: document.getElementById("inactiveCount"),
        aRate: document.getElementById("activityRate"),
        aBar: document.getElementById("activityBar")
    };
    if (elements.uCount)
        elements.uCount.textContent = totalUsers.toString();
    if (elements.aCount)
        elements.aCount.textContent = totalActive.toString();
    if (elements.iCount)
        elements.iCount.textContent = (totalUsers - totalActive).toString();
    if (elements.aRate)
        elements.aRate.textContent = `${activityPercentage}%`;
    if (elements.aBar)
        elements.aBar.style.width = `${activityPercentage}%`;
    arrayToRender.forEach(user => {
        const cardDiv = document.createElement("div");
        cardDiv.className = `user-card ${selectedUserId === user.id ? 'selected' : ''}`;
        const countTasks = listTasks.filter(t => t.userId === user.id).length;
        cardDiv.innerHTML = `
            <div class="user-header">
                <span class="user-id-badge">ID: ${user.id}</span>
                <h3>${user.name}</h3>
            </div>
            <p style="font-size:0.8rem; color:#666">${user.email}</p>
            <p>Estado: <span class="${user.active ? 'status-active' : 'status-inactive'}">${user.active ? 'Ativo' : 'Inativo'}</span></p>
            <div class="tasks-area"><p><strong>${countTasks}</strong> tarefas</p></div>
            <div class="card-actions">
                <button class="btnToggle" data-id="${user.id}">${user.active ? 'Desativar' : 'Ativar'}</button>
                <button class="btnRemoveUser" data-id="${user.id}">Remover</button>
            </div>
        `;
        cardDiv.onclick = (e) => {
            const target = e.target;
            if (target.tagName !== 'BUTTON') {
                setSelectedUserId(user.id); // ATUALIZA O ID NO SERVIÇO
                selectUser(user.id); // CHAMA A FUNÇÃO DE UI
                window.abrirModalDetalhes(user);
            }
        };
        cardDiv.querySelector(".btnToggle")?.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleUserStatus(user.id);
            renderUsers();
        });
        cardDiv.querySelector(".btnRemoveUser")?.addEventListener("click", (e) => {
            e.stopPropagation();
            if (confirm("Deseja eliminar este utilizador e as suas tarefas?")) {
                removeUserLogic(user.id);
                removeTasksByUserId(user.id);
                if (selectedUserId === user.id) {
                    setSelectedUserId(null);
                    selectedUserNameUI.textContent = "Nenhum selecionado";
                }
                renderUsers();
                renderTasks();
            }
        });
        usersListUI.appendChild(cardDiv);
    });
}
export function selectUser(id) {
    setSelectedUserId(id);
    const user = listUsers.find(u => u.id === id);
    if (user) {
        selectedUserNameUI.textContent = user.name;
        const idDisplay = document.getElementById("selectedUserIdDisplay");
        if (idDisplay)
            idDisplay.textContent = id.toString();
        renderUsers();
        renderTasks();
    }
}
