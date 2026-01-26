import { UserClass } from './models/index.js';
import { workCategoria, subjectCategoria } from './utils/utilTypes.js';
import { 
    listUsers, 
    selectedUserId, 
    loadInitialData, 
    toggleUserStatus, 
    removeUserLogic,
    setSelectedUserId 
} from './services/index.js';
import { listTasks, setListTasks, removeTasksByUserId } from './services/index.js';
import { renderUsers, renderTasks, selectUser } from './ui/index.js';

// Seletores do DOM
const newTaskInput = document.getElementById("newTask") as HTMLTextAreaElement;
const taskModal = document.getElementById("taskModal") as HTMLDialogElement;
const errorModal = document.getElementById("errorModal") as HTMLDialogElement;
const confirmModal = document.getElementById("confirmModal") as HTMLDialogElement;
const selectedUserNameUI = document.getElementById("selectedUserName") as HTMLSpanElement;


//Listeners de Usuários
document.getElementById("formAdd")?.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById("name") as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const erroDisplay = document.getElementById("erro") as HTMLSpanElement;

    if (erroDisplay) {
        erroDisplay.innerHTML = "";
        erroDisplay.className = "";
    }

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();

    if (nameValue === "" || emailValue === "") {
        if (erroDisplay) {
            erroDisplay.innerHTML = "Preencha os campos corretamente";
            erroDisplay.className = "erro";
        }
        return;
    } 
    

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
        if (erroDisplay) {
        erroDisplay.innerHTML = 'Introduza um endereço de e-mail válido (ex: nome@dominio.com)';
        erroDisplay.className = "erro";
        }
        return;
    }

    const newId = listUsers.length > 0 ? Math.max(...listUsers.map(u => u.id)) + 1 : 1;
    const newUser = new UserClass(newId, nameValue, emailValue, true);

    listUsers.push(newUser);
    
    renderUsers();
    (e.target as HTMLFormElement).reset();
});

document.getElementById("searchInput")?.addEventListener("input", (e) => {
    const val = (e.target as HTMLInputElement).value.toLowerCase();
    renderUsers(listUsers.filter(u => u.name.toLowerCase().includes(val)));
});

document.getElementById("sortName")?.addEventListener("click", () => {
    listUsers.sort((a, b) => a.name.localeCompare(b.name));
    renderUsers();
});

document.getElementById("filterActive")?.addEventListener("click", () => {
    renderUsers(listUsers.filter(u => u.active));
});

document.getElementById("showAll")?.addEventListener("click", () => renderUsers(listUsers));

//Listeners de Tarefas
document.getElementById("searchTask")?.addEventListener("input", (e) => {
    if (selectedUserId === null) return;
    const val = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = listTasks.filter(t => t.userId === selectedUserId && t.title.toLowerCase().includes(val));
    renderTasks(filtered);
});

document.getElementById("btnSort")?.addEventListener("click", () => {
    if (selectedUserId === null) return;
    const sorted = listTasks.filter(t => t.userId === selectedUserId).sort((a, b) => a.title.localeCompare(b.title));
    renderTasks(sorted);
});

document.getElementById("btnClearCompleted")?.addEventListener("click", async () => {
    if (selectedUserId === null) {
        showModal("Selecione um utilizador primeiro!");
        return;
    }
    const temConcluidas = listTasks.some(t => t.userId === selectedUserId && t.completed);
    if (!temConcluidas) {
        showModal("Não existem tarefas concluídas!");
        return;
    }
    const confirmado = await askConfirmation("Deseja remover as tarefas concluídas?");
    if (confirmado) {
        setListTasks(listTasks.filter(t => t.userId !== selectedUserId || !t.completed));
        renderTasks();
        renderUsers();
    }
});

//Modal de Tarefa (Salvar/Editar)
document.getElementById("btnSaveTask")?.addEventListener("click", () => {
    const categoryElem = document.getElementById("categorySelect") as HTMLSelectElement;
    const subjectElem = document.getElementById("subjectSelect") as HTMLSelectElement;
    const editTaskIdElem = document.getElementById("editTaskId") as HTMLInputElement;

    if (!newTaskInput || !categoryElem || !subjectElem) return;

    const cat = categoryElem.value as workCategoria;
    const sub = subjectElem.value as subjectCategoria;
    const taskIdStr = editTaskIdElem.value;

    if (newTaskInput.value.trim().length > 3) {
        if (taskIdStr) {
            const idToEdit = parseInt(taskIdStr);
            const taskIndex = listTasks.findIndex(t => t.id === idToEdit);
            if (taskIndex !== -1) {
                listTasks[taskIndex].title = newTaskInput.value;
                listTasks[taskIndex].category = cat;
                listTasks[taskIndex].subject = sub;
            }
        } else {
            if (selectedUserId === null) {
                showModal("Selecione um utilizador primeiro.");
                return;
            }
            
            listTasks.push({
                id: Date.now(),
                userId: selectedUserId,
                title: newTaskInput.value,
                completed: false,
                category: cat,
                subject: sub,
                createdAt: new Date()
            });
        }

        newTaskInput.value = "";
        editTaskIdElem.value = "";
        taskModal.close();
        
        renderTasks();
        renderUsers();
    } else {
        showModal("A descrição deve ter mais de 3 caracteres.");
    }
});

document.getElementById("btnCancelTask")?.addEventListener("click", () => {
    taskModal.close();
});

//Funções Auxiliares de UI (Expostas no Window)
(window as any).abrirModalDetalhes = (user: any) => {
    const modalDetails = document.getElementById("userDetails") as HTMLElement;
    const detailsContent = document.getElementById("detailsContent") as HTMLElement;
    const dataCriacao = new Date(user.createdAt).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const tarefasDoUsuario = listTasks.filter(t => t.userId === user.id);
    const concluidas = tarefasDoUsuario.filter(t => t.completed).length;

    detailsContent.innerHTML = `
        <div class="modal-info">
            <p><strong>Nome:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Status:</strong> ${user.active ? 'Ativo' : 'Inativo'}</p>
            <p><strong>Criado em:</strong> ${dataCriacao}</p> <hr>
            <hr>
            <ul>
                <li>Total: ${tarefasDoUsuario.length}</li>
                <li>Concluídas: ${concluidas}</li>
            </ul>
        </div>
    `;
    modalDetails.style.display = "block";
};

(window as any).openEditModal = (taskId: number) => {
    const task = listTasks.find(t => t.id === taskId);
    if (!task) return;
    (document.getElementById("editTaskId") as HTMLInputElement).value = taskId.toString();
    newTaskInput.value = task.title;
    (document.getElementById("categorySelect") as HTMLSelectElement).value = task.category;
    (document.getElementById("subjectSelect") as HTMLSelectElement).value = task.subject;
    taskModal.showModal();
};

function showModal(message: string): void {
    const msgContainer = document.getElementById("modalMessage");
    if (errorModal && msgContainer) {
        msgContainer.innerText = message;
        errorModal.showModal();
    }
}

function askConfirmation(message: string): Promise<boolean> {
    const msgContainer = document.getElementById("confirmMessage");
    const btnConfirm = document.getElementById("btnConfirmAction");
    const btnCancel = document.getElementById("btnCancel");
    if (msgContainer) msgContainer.innerText = message;
    confirmModal.showModal();

    return new Promise((resolve) => {
        btnConfirm?.addEventListener("click", () => { confirmModal.close(); resolve(true); }, { once: true });
        btnCancel?.addEventListener("click", () => { confirmModal.close(); resolve(false); }, { once: true });
    });
}


loadInitialData(renderUsers);

//Se houver botões no HTML chamando funções diretamente:
(window as any).renderUsers = renderUsers;
(window as any).renderTasks = renderTasks;

document.querySelectorAll(".btnCloseModal").forEach(btn => {
    btn.addEventListener("click", () => {
        const modal = btn.closest("dialog") || (document.getElementById("userDetails") as HTMLElement);
        if (modal instanceof HTMLDialogElement) {
            modal.close();
        } else if (modal) {
            modal.style.display = "none";
        }
    });
});

// --- Listener para fechar o Modal de Erro ---
document.getElementById("closeModal")?.addEventListener("click", () => {
    const errorModal = document.getElementById("errorModal") as HTMLDialogElement;
    if (errorModal) {
        errorModal.close(); // Fecha o elemento <dialog>
    }
});

document.getElementById("closeDetails")?.addEventListener("click", () => {
    const modalDetails = document.getElementById("userDetails");
    if (modalDetails) modalDetails.style.display = "none";
});

document.getElementById("openModalBtn")?.addEventListener("click", () => {
    if (selectedUserId === null) {
        showModal("Por favor, selecione um utilizador primeiro!");
        return;
    }

    (document.getElementById("editTaskId") as HTMLInputElement).value = "";
    newTaskInput.value = "";
    
    const modalTitle = document.querySelector("#taskModal h2");
    if (modalTitle) modalTitle.textContent = "Nova Tarefa";
    
    taskModal.showModal();
});