import { 
    listUsers, 
    selectedUserId, 
    toggleUserStatus, 
    removeUserLogic, 
    setSelectedUserId, 
    listTasks, 
    removeTasksByUserId, 
    StatisticsService,
    getTaskUrgencyMessage,
    countUserTasks 
} from '../services/index.js';
import { renderTasks } from './renderTask.js';
import { assignmentService } from '../services/AssignmentService.js';
import { openUserDetailsModal } from '../app/initialization.js';

const usersListUI = document.getElementById("usersList");
const selectedUserNameUI = document.getElementById("selectedUserName");
const assignSelectUI = document.getElementById("assignSelect") as HTMLSelectElement;

// Renderiza a lista de cartões de utilizadores e atualiza estatísticas
export function renderUsers(arrayToRender = listUsers) {
    if (!usersListUI) return;

    usersListUI.innerHTML = "";

    renderAssignOptions();
    renderUserFilterOptions();

    // RENDERIZAÇÃO DOS CARDS (SEM BOTÃO ATIVAR/DESATIVAR)
    arrayToRender.forEach(user => {
        const cardDiv = document.createElement("div");
        cardDiv.className = `user-card ${selectedUserId === user.getId ? 'selected' : ''}`;
        cardDiv.setAttribute("data-id", user.getId.toString());

        const countTasks = listTasks.filter(t => {
            const isOwner = t.userId === user.getId;
            const isAssigned = assignmentService.getUsersFromTask(t.id).includes(user.getId);
            return isOwner || isAssigned;
        }).length;

        // Obter a mensagem condicional baseada no número de tarefas
        const { message, status } = getTaskUrgencyMessage(countTasks);

        cardDiv.innerHTML = `
            <div class="user-header">
                <span class="user-id-badge">ID: ${user.getId}</span>
                <h3>${user.name}</h3>
            </div>
            <p style="font-size:0.8rem; color:#666">${user.getEmail()}</p>
            <p>Estado: <span class="${user.isActive() ? 'status-active' : 'status-inactive'}">${user.isActive() ? 'Ativo' : 'Inativo'}</span></p>
            <p>Função: <span style="font-weight:bold; color:#2c3e50;">${user.getRole()}</span></p>
            <div class="tasks-area"><p><strong>${countTasks}</strong> tarefas</p></div>
            <div class="urgency-message" data-status="${status}">
                ${message}
            </div>
        `;

        // Clique no card para abrir detalhes
        cardDiv.addEventListener("click", () => {
            selectUser(user.getId);
            openUserDetailsModal(user);
        });

        usersListUI.appendChild(cardDiv);
    });

    updateExtendedStatistics();
}

export function selectUser(id: number) {
    setSelectedUserId(id);
    const user = listUsers.find(u => u.getId === id);

    if (user) {
        if (selectedUserNameUI) selectedUserNameUI.textContent = user.name;
        const idDisplay = document.getElementById("selectedUserIdDisplay");
        if (idDisplay) idDisplay.textContent = id.toString();

        renderUsers();
        renderTasks();
        updateExtendedStatistics();
    }
}

// Excluir o criador da tarefa da lista de colaboradores
export function renderAssignOptions() {
    if (!assignSelectUI) return;

    const selectedValues = Array.from(assignSelectUI.selectedOptions)
        .map((opt: HTMLOptionElement) => opt.value);

    // FILTRAR: Remover o criador da lista
    const availableUsers = listUsers.filter(user => {
        if (selectedUserId === null) return true;
        return user.getId !== selectedUserId;
    });

    assignSelectUI.innerHTML = availableUsers
        .map(user => `
            <option value="${user.getId}" 
                    ${selectedValues.includes(user.getId.toString()) ? 'selected' : ''}>
                ${user.name} (${user.isActive() ? 'Ativo' : 'Inativo'})
            </option>
        `).join("");
}

// Renderiza estatísticas globais e específicas do usuário
export function updateExtendedStatistics() {
    const usersStatsInline = document.getElementById("users-stats-inline");
    
    if (usersStatsInline) {
        const totalUsers = listUsers.length;
        const activeUsers = listUsers.filter(u => u.isActive()).length;
        const inactiveUsers = totalUsers - activeUsers;
        const usersPercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

        usersStatsInline.innerHTML = `
            <div class="stat-item">
                <span class="stat-num">${totalUsers}</span>
                <span class="stat-label">Usuários</span>
            </div>
            <div class="stat-item">
                <span class="stat-num stat-active">${activeUsers}</span>
                <span class="stat-label">Ativos</span>
            </div>
            <div class="stat-item">
                <span class="stat-num stat-inactive">${inactiveUsers}</span>
                <span class="stat-label">Inativos</span>
            </div>
            <div class="stat-item">
                <span class="stat-num stat-percentage">${usersPercentage}%</span>
                <span class="stat-label">Atividade</span>
            </div>
        `;
    }

    // 2. ESTATÍSTICAS GLOBAIS DE TAREFAS (todas as tarefas do sistema)
    const tasksStatsGlobal = document.getElementById("tasks-stats-global");
    
    if (tasksStatsGlobal) {
        const totalTasks = StatisticsService.countTasks();
        const completedTasks = StatisticsService.countCompletedTasks();
        const completionPercentage = StatisticsService.getCompletionPercentage();

        tasksStatsGlobal.innerHTML = `
            <div class="stat-item">
                <span class="stat-num">${totalTasks}</span>
                <span class="stat-label">Total</span>
            </div>
            <div class="stat-item">
                <span class="stat-num stat-completed">${completedTasks}</span>
                <span class="stat-label">Concluídas</span>
            </div>
            <div class="stat-item">
                <span class="stat-num stat-percentage">${completionPercentage}%</span>
                <span class="stat-label">Conclusão</span>
            </div>
        `;
    }

    // 3. ESTATÍSTICAS ESPECÍFICAS DO USUÁRIO SELECIONADO
    const tasksStatsUser = document.getElementById("tasks-stats-user");
    
    if (tasksStatsUser) {
        if (selectedUserId === null) {
            tasksStatsUser.style.display = 'none';
        } else {
            tasksStatsUser.style.display = 'flex';
            
            const currentUserId = selectedUserId;
            
            const userTasks = listTasks.filter(t => {
                const isOwner = t.userId === currentUserId;
                const isAssigned = assignmentService.getUsersFromTask(t.id).includes(currentUserId);
                return isOwner || isAssigned;
            });

            const userTasksTotal = userTasks.length;
            const userTasksCompleted = userTasks.filter(t => t.completed).length;
            const userTasksPending = userTasksTotal - userTasksCompleted;
            const userCompletionPercentage = userTasksTotal > 0 
                ? Math.round((userTasksCompleted / userTasksTotal) * 100) 
                : 0;

            tasksStatsUser.innerHTML = `
                <div class="stat-item stat-item-small">
                    <span class="stat-num">${userTasksTotal}</span>
                    <span class="stat-label">Tarefas</span>
                </div>
                <div class="stat-item stat-item-small">
                    <span class="stat-num stat-completed">${userTasksCompleted}</span>
                    <span class="stat-label">Concluídas</span>
                </div>
                <div class="stat-item stat-item-small">
                    <span class="stat-num stat-inactive">${userTasksPending}</span>
                    <span class="stat-label">Pendentes</span>
                </div>
                <div class="stat-item stat-item-small">
                    <span class="stat-num stat-percentage">${userCompletionPercentage}%</span>
                    <span class="stat-label">Conclusão</span>
                </div>
            `;
        }
    }
}

export function renderUserFilterOptions() {
    const sel = document.getElementById('search-user') as HTMLSelectElement;
    if (!sel) return;

    const current = sel.value;

    sel.innerHTML = '<option value="">Todos</option>' +
        listUsers.map(u => `
            <option value="${u.getId}" ${current === String(u.getId) ? 'selected' : ''}>
                ${u.name} (${u.isActive() ? 'Ativo' : 'Inativo'})
            </option>
        `).join('');
}
