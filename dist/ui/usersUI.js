import { listUsers, listTasks, selectedUserId } from '../state/state.js';
import { removeUser, toggleUserStatus, selectUser } from '../services/userService.js';
import { abrirModalDetalhes } from './modalsUI.js';
export function renderUsers(arrayToRender = listUsers) {
    const usersListUI = document.getElementById("usersList");
    usersListUI.innerHTML = "";
    const totalUsers = listUsers.length;
    const totalActive = listUsers.filter(u => u.active).length;
    const totalInactive = totalUsers - totalActive;
    const activityPercentage = totalUsers > 0
        ? Math.round((totalActive / totalUsers) * 100)
        : 0;
    document.getElementById("userCount").textContent = totalUsers.toString();
    document.getElementById("activeCount").textContent = totalActive.toString();
    document.getElementById("inactiveCount").textContent = totalInactive.toString();
    document.getElementById("activityRate").textContent = `${activityPercentage}%`;
    document.getElementById("activityBar").style.width = `${activityPercentage}%`;
    arrayToRender.forEach(user => {
        const cardDiv = document.createElement("div");
        cardDiv.className = `user-card ${selectedUserId === user.id ? 'selected' : ''}`;
        const countTasks = listTasks.filter(t => t.userId === user.id).length;
        cardDiv.innerHTML = `...IGUAL AO SEU HTML...`;
        cardDiv.onclick = (e) => {
            if (e.target.tagName !== 'BUTTON') {
                selectUser(user.id);
                abrirModalDetalhes(user);
            }
        };
        cardDiv.querySelector(".btnToggle")?.addEventListener("click", e => {
            e.stopPropagation();
            toggleUserStatus(user.id);
        });
        cardDiv.querySelector(".btnRemoveUser")?.addEventListener("click", e => {
            e.stopPropagation();
            removeUser(user.id);
        });
        usersListUI.appendChild(cardDiv);
    });
}
