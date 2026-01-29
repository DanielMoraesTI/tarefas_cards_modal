import { 
    loadInitialData, 
    listTasks, 
    createFakeTasksIfEmpty, 
    assignmentService 
} from './services/index.js';
import { 
    renderUsers, 
    renderTasks, 
    setupEventListeners, 
    setUserSendoVisualizado, 
    updateExtendedStatistics 
} from './ui/index.js';
import { ITask } from './tasks/ITask.js';

setupEventListeners();

// Carga inicial de dados com callback de renderização
loadInitialData(() => {
    createFakeTasksIfEmpty();
    renderUsers();
    renderTasks();
    updateExtendedStatistics();
});

// EXPOSIÇÃO GLOBAL

// Abre o modal de detalhes do utilizador
(window as any).abrirModalDetalhes = (user: any) => {
    const modalDetails = document.getElementById("userDetails");
    if (!modalDetails || !user) return;

    setUserSendoVisualizado(user);
    
    const detailName = document.getElementById("detailName");
    const detailEmail = document.getElementById("detailEmail");
    const detailRole = document.getElementById("detailRole");

    if (detailName) detailName.textContent = user.name;
    if (detailEmail) detailEmail.textContent = typeof user.getEmail === 'function' ? user.getEmail() : user.email;
    if (detailRole) detailRole.textContent = typeof user.getRole === 'function' ? user.getRole() : user.role;

    if (modalDetails instanceof HTMLDialogElement) {
        modalDetails.showModal();
    } else {
        modalDetails.classList.remove("details-overlay-hidden");
        modalDetails.style.display = "block";
    }

    (window as any).refreshModalData = () => (window as any).abrirModalDetalhes(user);
};

// Lógica centralizada para abrir o modal de edição de tarefa
(window as any).openEditModal = (taskId: number) => {
    const task = (listTasks as ITask[]).find((t: ITask) => t.id === taskId);
    
    if (task) {
        const editTaskIdElem = document.getElementById("editTaskId") as HTMLInputElement;
        const newTaskInput = document.getElementById("newTask") as HTMLTextAreaElement;
        const taskModal = document.getElementById("taskModal") as HTMLDialogElement;
        const assignSelect = document.getElementById("assignSelect") as HTMLSelectElement;
        const prioritySelect = document.getElementById("prioritySelect") as HTMLSelectElement;

        if (editTaskIdElem && newTaskInput && taskModal) {
            editTaskIdElem.value = taskId.toString();
            newTaskInput.value = task.title;

            if (assignSelect) {
                Array.from(assignSelect.options).forEach(opt => opt.selected = false);
                const assignedIds = assignmentService.getUsersFromTask(taskId);
                assignedIds.forEach(uid => {
                    const option = assignSelect.querySelector(`option[value="${uid}"]`) as HTMLOptionElement;
                    if (option) option.selected = true;
                });
            }

            taskModal.showModal();
        }
    }
};

// Atalho global para abrir edição aceitando objeto ou ID
(window as any).abrirModalEdicao = (taskOrId: any) => {
    if (!taskOrId) return;
    
    const id = typeof taskOrId === 'number' 
        ? taskOrId 
        : (taskOrId.id ?? (typeof taskOrId.getId === 'function' ? taskOrId.getId : null));
    
    if (id !== null) {
        (window as any).openEditModal(Number(id));
    }
};

// Exposição das funções de renderização para depuração ou chamadas externas
(window as any).renderUsers = renderUsers;
(window as any).renderTasks = renderTasks;
(window as any).updateStats = updateExtendedStatistics;