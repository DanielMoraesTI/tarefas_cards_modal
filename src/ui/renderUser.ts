import { UserClass } from '../models/index.js';
import { 
    listUsers, 
    selectedUserId, 
    toggleUserStatus, 
    removeUserLogic, 
    setSelectedUserId, 
    listTasks, 
    removeTasksByUserId, 
    StatisticsService 
} from '../services/index.js';
import { renderTasks } from './renderTask.js';
import { assignmentService } from '../services/AssignmentService.js';

const usersListUI = document.getElementById("usersList") as HTMLUListElement;
const selectedUserNameUI = document.getElementById("selectedUserName") as HTMLSpanElement;
const assignSelectUI = document.getElementById("assignSelect") as HTMLSelectElement;

/**
 * Renderiza a lista de cartões de utilizadores e atualiza estatísticas
 */
export function renderUsers(arrayToRender: UserClass[] = listUsers): void {
    if (!usersListUI) return;
    usersListUI.innerHTML = "";
    
    // --- CÁLCULO DE ESTATÍSTICAS ---
    const totalUsers = listUsers.length;
    const totalActive = listUsers.filter(u => u.isActive()).length;
    const activityPercentage = totalUsers > 0 ? Math.round((totalActive / totalUsers) * 100) : 0;

    const elements = {
        uCount: document.getElementById("userCount"),
        aCount: document.getElementById("activeCount"),
        iCount: document.getElementById("inactiveCount"),
        aRate: document.getElementById("activityRate"),
        aBar: document.getElementById("activityBar")
    };

    if (elements.uCount) elements.uCount.textContent = totalUsers.toString();
    if (elements.aCount) elements.aCount.textContent = totalActive.toString();
    if (elements.iCount) elements.iCount.textContent = (totalUsers - totalActive).toString();
    if (elements.aRate) elements.aRate.textContent = `${activityPercentage}%`;
    if (elements.aBar) elements.aBar.style.width = `${activityPercentage}%`;

    renderAssignOptions();
    renderUserFilterOptions();

    // --- RENDERIZAÇÃO DOS CARDS ---
    arrayToRender.forEach(user => {
        const cardDiv = document.createElement("div");
        
        // CORREÇÃO: Adicionando data-id e classe user-card para a Delegação de Eventos
        cardDiv.className = `user-card ${selectedUserId === user.getId ? 'selected' : ''}`;
        cardDiv.setAttribute("data-id", user.getId.toString());
        
        const countTasks = listTasks.filter(t => {
            const isOwner = t.userId === user.getId;
            const isAssigned = assignmentService.getUsersFromTask(t.id).includes(user.getId);
            return isOwner || isAssigned;
        }).length;

        cardDiv.innerHTML = `
            <div class="user-header">
                <span class="user-id-badge">ID: ${user.getId}</span>
                <h3>${user.name}</h3>
            </div>
            <p style="font-size:0.8rem; color:#666">${user.getEmail()}</p>
            <p>Estado: <span class="${user.isActive() ? 'status-active' : 'status-inactive'}">${user.isActive() ? 'Ativo' : 'Inativo'}</span></p>
            <p>Função: <span style="font-weight:bold; color:#2c3e50;">${user.getRole()}</span></p>
            <div class="tasks-area"><p><strong>${countTasks}</strong> tarefas</p></div>
            <div class="card-actions">
                <button class="btnToggle" data-id="${user.getId}">${user.isActive() ? 'Desativar' : 'Ativar'}</button>
                <button class="btnRemoveUser" data-id="${user.getId}">Remover</button>
            </div>
        `;

        // Removido o cardDiv.onclick individual para não conflitar com a delegação de eventos
        // que agora está centralizada no eventHandlers.ts

        // Botão de Alternar Status (Ativo/Inativo)
        cardDiv.querySelector(".btnToggle")?.addEventListener("click", (e) => {
            e.stopPropagation(); // Impede que o clique no botão abra o modal de detalhes
            toggleUserStatus(user.getId);
            renderUsers();
        });

        // Botão de Remover Usuário
        cardDiv.querySelector(".btnRemoveUser")?.addEventListener("click", (e) => {
            e.stopPropagation(); // Impede que o clique no botão abra o modal de detalhes
            if (confirm("Deseja eliminar este utilizador e as suas tarefas?")) {
                removeUserLogic(user.getId);
                removeTasksByUserId(user.getId);
                if (selectedUserId === user.getId) {
                    setSelectedUserId(null);
                    selectedUserNameUI.textContent = "Nenhum selecionado";
                }
                renderUsers();
                renderTasks();
            }
        });

        usersListUI.appendChild(cardDiv);
    });
    updateExtendedStatistics();
}

export function selectUser(id: number): void {
    setSelectedUserId(id);
    const user = listUsers.find(u => u.getId === id);
    if (user) {
        selectedUserNameUI.textContent = user.name;
        const idDisplay = document.getElementById("selectedUserIdDisplay");
        if (idDisplay) idDisplay.textContent = id.toString();
        renderUsers();
        renderTasks();
    }
}

export function renderAssignOptions(): void {
    if (!assignSelectUI) return;
    const selectedValues = Array.from(assignSelectUI.selectedOptions).map(opt => opt.value);

    assignSelectUI.innerHTML = listUsers
        .map(user => `
            <option value="${user.getId}" ${selectedValues.includes(user.getId.toString()) ? 'selected' : ''}>
                ${user.name} (${user.isActive() ? 'Ativo' : 'Inativo'})
            </option>
        `).join("");
}

export function updateExtendedStatistics(): void {
    const left = document.getElementById("counters-left") as HTMLElement;
    const right = document.getElementById("counters-right") as HTMLElement;
    if (!left || !right) return;

    const totalUsers = listUsers.length;
    const activeUsers = listUsers.filter(u => u.isActive()).length;
    const inactiveUsers = totalUsers - activeUsers;
    const usersPercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    const totalTasks = StatisticsService.countTasks();
    const completedTasks = StatisticsService.countCompletedTasks();
    const completionPercentage = StatisticsService.getCompletionPercentage();
    
    left.innerHTML = `
        <div class="counter-group left">
            <div class="counter-block">
                <div class="num num-total">${totalUsers}</div>
                <div class="label">Usuários</div>
            </div>
            <div class="counter-block">
                <div class="num num-active">${activeUsers}</div>
                <div class="label">Ativos</div>
            </div>
            <div class="counter-block">
                <div class="num num-inactive">${inactiveUsers}</div>
                <div class="label">Inativos</div>
            </div>
            <div class="counter-block">
                <div class="num num-percentage">${usersPercentage}%</div>
                <div class="label">Ativos %</div>
            </div>
        </div>
    `;

    right.innerHTML = `
        <div class="counter-group right">
            <div class="counter-block">
                <div class="num num-total">${totalTasks}</div>
                <div class="label">Tarefas</div>
            </div>
            <div class="counter-block">
                <div class="num num-completed">${completedTasks}</div>
                <div class="label">Concluídas</div>
            </div>
            <div class="counter-block">
                <div class="num num-percentage">${completionPercentage}%</div>
                <div class="label">Conclusão</div>
            </div>
        </div>
    `;
}

export function renderUserFilterOptions(): void {
    const sel = document.getElementById('search-user') as HTMLSelectElement | null;
    if (!sel) return;
    const current = sel.value;
    sel.innerHTML = '<option value="">Todos</option>' + 
        listUsers.map(u => `
            <option value="${u.getId}" ${current === String(u.getId) ? 'selected' : ''}>
                ${u.name} (${u.isActive() ? 'Ativo' : 'Inativo'})
            </option>
        `).join('');
}