import { loadInitialData, listTasks, createFakeTasksIfEmpty, assignmentService } from './services/index.js';
import { renderUsers, renderTasks, setupEventListeners, setUserSendoVisualizado, updateExtendedStatistics } from './ui/index.js';
/**
 * Inicializa os ouvintes de eventos antes de carregar os dados
 * para garantir que a UI responda assim que renderizada.
 */
setupEventListeners();
/**
 * Carga inicial de dados com callback de renderização
 */
loadInitialData(() => {
    // Ordem lógica: Criar tarefas fakes -> Renderizar tudo -> Estatísticas
    createFakeTasksIfEmpty();
    renderUsers();
    renderTasks();
    updateExtendedStatistics();
});
// --- EXPOSIÇÃO GLOBAL ---
// Necessária para chamadas diretas via strings no HTML ou onclicks legados
/**
 * Abre o modal de detalhes do utilizador
 */
window.abrirModalDetalhes = (user) => {
    const modalDetails = document.getElementById("userDetails");
    if (!modalDetails || !user)
        return;
    setUserSendoVisualizado(user);
    // Preenchimento dos campos no DOM
    const detailName = document.getElementById("detailName");
    const detailEmail = document.getElementById("detailEmail");
    const detailRole = document.getElementById("detailRole");
    if (detailName)
        detailName.textContent = user.name;
    // Tenta usar o método getEmail/getRole da classe, senão usa a propriedade
    if (detailEmail)
        detailEmail.textContent = typeof user.getEmail === 'function' ? user.getEmail() : user.email;
    if (detailRole)
        detailRole.textContent = typeof user.getRole === 'function' ? user.getRole() : user.role;
    // Lógica de exibição compatível com dialog ou div comum
    if (modalDetails instanceof HTMLDialogElement) {
        modalDetails.showModal();
    }
    else {
        modalDetails.classList.remove("details-overlay-hidden");
        modalDetails.style.display = "block";
    }
    // Função de atualização rápida do modal se houver mudanças nos dados
    window.refreshModalData = () => window.abrirModalDetalhes(user);
};
/**
 * Lógica centralizada para abrir o modal de edição de tarefa
 */
window.openEditModal = (taskId) => {
    const task = listTasks.find((t) => t.id === taskId);
    if (task) {
        const editTaskIdElem = document.getElementById("editTaskId");
        const newTaskInput = document.getElementById("newTask");
        const taskModal = document.getElementById("taskModal");
        const assignSelect = document.getElementById("assignSelect");
        const prioritySelect = document.getElementById("prioritySelect");
        if (editTaskIdElem && newTaskInput && taskModal) {
            editTaskIdElem.value = taskId.toString();
            newTaskInput.value = task.title;
            // Sincroniza os usuários atribuídos no select multiple
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
};
/**
 * Atalho global para abrir edição aceitando objeto ou ID
 */
window.abrirModalEdicao = (taskOrId) => {
    if (!taskOrId)
        return;
    // Resolve o ID independentemente de vir um número, objeto Task ou UserClass
    const id = typeof taskOrId === 'number'
        ? taskOrId
        : (taskOrId.id ?? (typeof taskOrId.getId === 'function' ? taskOrId.getId : null));
    if (id !== null) {
        window.openEditModal(Number(id));
    }
};
// Exposição das funções de renderização para depuração ou chamadas externas
window.renderUsers = renderUsers;
window.renderTasks = renderTasks;
window.updateStats = updateExtendedStatistics;
