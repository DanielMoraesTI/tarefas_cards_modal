/**
 * APP INITIALIZATION - Inicialização da Aplicação
 *
 * Responsável por:
 * - Carregar dados iniciais
 * - Renderizar UI
 * - Configurar event listeners
 * - Inicializar modais
 */
import { loadInitialData, loadInitialTasksData, loadTasksTagsFallback } from '../services/index.js';
import { renderUsers, renderTasks, setupEventListeners, updateExtendedStatistics, renderDashboard, setupSystemModals, ViewToggle } from '../ui/index.js';
/**
 * Inicializa a aplicação após o DOM estar carregado
 */
export async function initializeApplication() {
    new ViewToggle();
    setupEventListeners();
    setupSystemModals();
    // Carregar usuários e tarefas do backend
    await loadInitialData(() => { });
    await loadInitialTasksData();
    // Carregar tags
    try {
        await loadTasksTagsFallback();
    }
    catch (error) {
        console.error('[initialization] Erro ao carregar tags:', error);
    }
    // Renderizar UI
    renderUsers();
    renderTasks();
    updateExtendedStatistics();
    // Atualizar UI para mostrar "Todos"
    const selectedUserNameElem = document.getElementById("selectedUserName");
    if (selectedUserNameElem) {
        selectedUserNameElem.textContent = "Todos os Utilizadores";
    }
    const selectedUserIdDisplay = document.getElementById("selectedUserIdDisplay");
    if (selectedUserIdDisplay) {
        selectedUserIdDisplay.textContent = "Todos";
    }
    renderDashboard();
}
/**
 * Atalho para abrir modal de detalhes do usuário
 */
export function openUserDetailsModal(user) {
    const modalDetails = document.getElementById("userDetails");
    if (!modalDetails || !user)
        return;
    const detailName = document.getElementById("detailName");
    const detailEmail = document.getElementById("detailEmail");
    const detailRole = document.getElementById("detailRole");
    const btnRemoveUserFromModal = document.getElementById("btnRemoveUserFromModal");
    if (detailName)
        detailName.textContent = user.name;
    if (detailEmail)
        detailEmail.textContent = typeof user.getEmail === 'function' ? user.getEmail() : user.email;
    if (detailRole)
        detailRole.textContent = typeof user.getRole === 'function' ? user.getRole() : user.role;
    // Configurar evento do botão remover
    if (btnRemoveUserFromModal) {
        btnRemoveUserFromModal.onclick = async () => {
            if (confirm(`Deseja eliminar o utilizador "${user.name}" e todas as suas tarefas?`)) {
                const { removeUserLogic, setSelectedUserId, selectedUserId } = await import('../services/userService.js');
                const { removeTasksByUserId } = await import('../services/taskService.js');
                const { renderUsers, renderTasks } = await import('../ui/index.js');
                // Aguardar o delete do backend
                await removeUserLogic(user.getId);
                removeTasksByUserId(user.getId);
                if (selectedUserId === user.getId) {
                    setSelectedUserId(null);
                    const selectedUserNameUI = document.getElementById("selectedUserName");
                    if (selectedUserNameUI)
                        selectedUserNameUI.textContent = "Nenhum utilizador selecionado";
                }
                // Fechar modal
                closeUserDetailsModal();
                // Atualizar UI
                renderUsers();
                renderTasks();
            }
        };
    }
    if (modalDetails instanceof HTMLDialogElement) {
        modalDetails.showModal();
    }
    else {
        modalDetails.classList.remove("details-overlay-hidden");
        modalDetails.style.display = "block";
    }
}
/**
 * Fecha o modal de detalhes do usuário
 */
function closeUserDetailsModal() {
    const modalDetails = document.getElementById("userDetails");
    if (!modalDetails)
        return;
    if (modalDetails instanceof HTMLDialogElement) {
        modalDetails.close();
    }
    else {
        modalDetails.classList.add("details-overlay-hidden");
        modalDetails.style.display = "none";
    }
}
/**
 * Atalho para abrir modal de edição de tarefa
 */
export async function openEditTaskModal(taskId) {
    const { listTasks } = await import('../services/taskService.js');
    const { assignmentService } = await import('../services/AssignmentService.js');
    const task = listTasks.find((t) => t.id === taskId);
    if (task) {
        const editTaskIdElem = document.getElementById("editTaskId");
        const newTaskInput = document.getElementById("newTask");
        const taskModal = document.getElementById("taskModal");
        const assignSelect = document.getElementById("assignSelect");
        if (editTaskIdElem && newTaskInput && taskModal) {
            editTaskIdElem.value = taskId.toString();
            newTaskInput.value = task.title;
            if (assignSelect) {
                Array.from(assignSelect.options).forEach(opt => opt.selected = false);
                const assignedIds = assignmentService.getUsersFromTask(taskId);
                assignedIds.forEach(uid => {
                    const option = assignSelect.querySelector(`option[value="${uid}"]`);
                    if (option)
                        option.selected = true;
                });
            }
            taskModal.showModal();
        }
    }
}
/**
 * Atalho genérico para abrir edição (aceita objeto ou ID)
 */
export async function openEditModal(taskOrId) {
    if (!taskOrId)
        return;
    const id = typeof taskOrId === 'number'
        ? taskOrId
        : (taskOrId.id ?? (typeof taskOrId.getId === 'function' ? taskOrId.getId : null));
    if (id !== null) {
        await openEditTaskModal(Number(id));
    }
}
