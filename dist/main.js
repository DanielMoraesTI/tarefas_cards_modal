import { loadInitialData, listTasks, createFakeTasksIfEmpty, assignmentService } from './services/index.js';
import { renderUsers, renderTasks, setupEventListeners, atualizarConteudoModal, setUserSendoVisualizado, updateExtendedStatistics } from './ui/index.js';
setupEventListeners();
loadInitialData(() => {
    renderUsers();
    createFakeTasksIfEmpty();
    renderTasks();
    renderUsers();
    updateExtendedStatistics();
});
//Exposição Global (Necessário para as chamadas diretas no seu HTML/Strings)
window.abrirModalDetalhes = (user) => {
    const modalDetails = document.getElementById("userDetails");
    if (modalDetails) {
        setUserSendoVisualizado(user);
        atualizarConteudoModal(user);
        modalDetails.classList.remove("details-overlay-hidden");
        window.refreshModalData = () => atualizarConteudoModal(user);
    }
};
window.openEditModal = (taskId) => {
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
};
window.abrirModalEdicao = (taskOrId) => {
    if (!taskOrId)
        return;
    const id = typeof taskOrId === 'number' ? taskOrId : (taskOrId.id ?? (taskOrId.getId ?? null));
    if (id === null)
        return;
    window.openEditModal?.(Number(id));
};
window.renderUsers = renderUsers;
window.renderTasks = renderTasks;
