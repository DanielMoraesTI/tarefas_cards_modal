import { loadInitialData, listTasks, createFakeTasksIfEmpty, assignmentService } from './services/index.js';
import { 
    renderUsers, 
    renderTasks, 
    setupEventListeners, 
    atualizarConteudoModal, 
    setUserSendoVisualizado, 
    updateExtendedStatistics 
} from './ui/index.js';
import { ITask } from './tasks/ITask.js';
import { Task } from './models/task.js';
import { BugTask } from './tasks/BugTask.js';
import { Priority } from './tasks/Priority.js';

setupEventListeners();

loadInitialData(() => {
    renderUsers();
    createFakeTasksIfEmpty();
    renderTasks();
    renderUsers();
    updateExtendedStatistics();
});

//Exposição Global (Necessário para as chamadas diretas no seu HTML/Strings)
(window as any).abrirModalDetalhes = (user: any) => {
    const modalDetails = document.getElementById("userDetails");
    if (modalDetails) {
        setUserSendoVisualizado(user);
        atualizarConteudoModal(user);
        modalDetails.classList.remove("details-overlay-hidden");
        
        (window as any).refreshModalData = () => atualizarConteudoModal(user);
    }
};

(window as any).openEditModal = (taskId: number) => {
    const task = (listTasks as ITask[]).find((t: ITask) => t.id === taskId);
    
    if (task) {
        const editTaskIdElem = document.getElementById("editTaskId") as HTMLInputElement;
        const newTaskInput = document.getElementById("newTask") as HTMLTextAreaElement;
        const taskModal = document.getElementById("taskModal") as HTMLDialogElement;
        const assignSelect = document.getElementById("assignSelect") as HTMLSelectElement;

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

    (window as any).abrirModalEdicao = (taskOrId: any) => {
        if (!taskOrId) return;
        const id = typeof taskOrId === 'number' ? taskOrId : (taskOrId.id ?? (taskOrId.getId ?? null));
        if (id === null) return;
        (window as any).openEditModal?.(Number(id));
    };

(window as any).renderUsers = renderUsers;
(window as any).renderTasks = renderTasks;