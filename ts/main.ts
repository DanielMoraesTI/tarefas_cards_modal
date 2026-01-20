//Molde para o User
interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;
}

class UserClass implements User {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public active: boolean = true
    ) {}
}

type workCategoria = 'Audiência' | 'Atendimento' | 'Análise';
type subjectCategoria = 'Civil' | 'Trabalhista' | 'Penal';

//Molde para Tarefas
interface Task {
    id: number;
    userId: number;
    title: string;
    completed: boolean;
    category: workCategoria;
    subject: subjectCategoria;
    concludedAt?: Date;
}

let listUsers: User[] = [];
let listTasks: Task[] = [];
let selectedUserId: number | null = null;

const usersListUI = document.getElementById("usersList") as HTMLUListElement;
const taskListUI = document.getElementById("taskList") as HTMLUListElement;
const newTaskInput = document.getElementById("newTask") as HTMLInputElement;
const selectedUserNameUI = document.getElementById("selectedUserName") as HTMLSpanElement;

//Função que verifica, gera os Usuários e calcula a quantidade de ativos, inativos e percentual de ativos
function renderUsers(arrayToRender: User[] = listUsers): void {
    usersListUI.innerHTML = "";
    
    const totalUsers = listUsers.length;
    const totalActive = listUsers.filter(u => u.active).length;
    const totalInactive = totalUsers - totalActive;
    const activityPercentage = totalUsers > 0 ? Math.round((totalActive / totalUsers) * 100) : 0;

    const uCount = document.getElementById("userCount");
    const aCount = document.getElementById("activeCount");
    const iCount = document.getElementById("inactiveCount");
    const aRate = document.getElementById("activityRate");
    const aBar = document.getElementById("activityBar");

    if (uCount) uCount.textContent = totalUsers.toString();
    if (aCount) aCount.textContent = totalActive.toString();
    if (iCount) iCount.textContent = totalInactive.toString();
    if (aRate) aRate.textContent = `${activityPercentage}%`;
    if (aBar) aBar.style.width = `${activityPercentage}%`;

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
        const target = e.target as HTMLElement;
        if (target.tagName !== 'BUTTON') {
            selectUser(user.id);
            abrirModalDetalhes(user);
        }
    };

        cardDiv.querySelector(".btnToggle")?.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleUserStatus(user.id);
        });

        cardDiv.querySelector(".btnRemoveUser")?.addEventListener("click", (e) => {
            e.stopPropagation();
            removeUser(user.id);
        });

        usersListUI.appendChild(cardDiv);
    });
}

//Função para remover usuários e atualizar lista de Cards
function removeUser(id: number): void {
    if (confirm("Deseja eliminar este utilizador e as suas tarefas?")) {
        listUsers = listUsers.filter(u => u.id !== id);
        listTasks = listTasks.filter(t => t.userId !== id);
        if (selectedUserId === id) {
            selectedUserId = null;
            selectedUserNameUI.textContent = "Nenhum selecionado";
        }
        renderUsers();
        renderTasks();
    }
}

function toggleUserStatus(id: number): void {
    const user = listUsers.find(u => u.id === id);
    if (user) {
        user.active = !user.active;
        renderUsers();
    }
}

function selectUser(id: number): void {
    selectedUserId = id;
    const user = listUsers.find(u => u.id === id);
    if (user) {
        selectedUserNameUI.textContent = user.name;
        const idDisplay = document.getElementById("selectedUserIdDisplay");
        if (idDisplay) idDisplay.textContent = id.toString();
        renderUsers();
        renderTasks();
    }
}

//Função para criar tarefas e atualizar lista determinada para cada usuário
function renderTasks(arrayToRender?: Task[]): void {
    taskListUI.innerHTML = "";
    if (selectedUserId === null) {
        taskListUI.innerHTML = "<li>Selecione um utilizador à esquerda</li>";
        return;
    }

    const tasksToShow = arrayToRender || listTasks.filter(t => t.userId === selectedUserId);

    tasksToShow.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        li.querySelector(".btnEdit")?.addEventListener("click", () => {
            openEditTask(task.id);
        });
        
        let completionDateHtml = "";
        if (task.completed && task.concludedAt) {
            const d = new Date(task.concludedAt);
            const dataFormatada = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
            completionDateHtml = `<br><small style="color: #666;">Concluída em: ${dataFormatada}</small>`;
        }

        li.innerHTML = `
            <div style="task-content" ${task.completed ? 'text-decoration: line-through; opacity: 0.6' : ''}">
                <span class="badge-cat">${task.category}</span>
                <span class="badge-sub">${task.subject}</span>
                <span class="task-title">${task.title}</span>
                ${completionDateHtml}
            </div>
            <div class="task-btns">
                <button class="btnEdit">Editar</button>
                <button class="btnDone">${task.completed ? 'Reabrir' : 'Concluída'}</button>
                <button class="btnDelTask">Fechar</button>
            </div>
        `;

        li.querySelector(".btnEdit")?.addEventListener("click", () => {
            openEditModal(task.id);
        });

        li.querySelector(".btnDone")?.addEventListener("click", () => {
            task.completed = !task.completed;
            task.concludedAt = task.completed ? new Date() : undefined;
            renderTasks();
            renderUsers();
        });

        li.querySelector(".btnDelTask")?.addEventListener("click", () => {
            listTasks = listTasks.filter(t => t.id !== task.id);
            renderTasks();
            renderUsers();
        });

        taskListUI.appendChild(li);
    });
}



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


document.getElementById("btnNew")?.addEventListener("click", () => {
    if (!selectedUserId) {
        showModal("Selecione um utilizador primeiro!");
        return;
    }
    
    if (newTaskInput.value.length > 3) {
        const cat = (document.getElementById("categorySelect") as HTMLSelectElement).value as workCategoria;
        const sub = (document.getElementById("subjectSelect") as HTMLSelectElement).value as subjectCategoria;

        listTasks.push({
            id: Date.now(),
            userId: selectedUserId,
            title: newTaskInput.value,
            completed: false,
            category: cat,
            subject: sub
        });
        
        newTaskInput.value = "";
        renderTasks();
        renderUsers();
    }
});


document.getElementById("searchInput")?.addEventListener("input", (e) => {
    const val = (e.target as HTMLInputElement).value.toLowerCase();
    renderUsers(listUsers.filter(u => u.name.toLowerCase().includes(val)));
});

document.getElementById("searchTask")?.addEventListener("input", (e) => {
    if (!selectedUserId) return;
    const val = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = listTasks.filter(t => t.userId === selectedUserId && t.title.toLowerCase().includes(val));
    renderTasks(filtered);
});

document.getElementById("sortName")?.addEventListener("click", () => {
    listUsers.sort((a, b) => a.name.localeCompare(b.name));
    renderUsers();
});

document.getElementById("filterActive")?.addEventListener("click", () => {
    renderUsers(listUsers.filter(u => u.active));
});

document.getElementById("showAll")?.addEventListener("click", () => renderUsers(listUsers));

document.getElementById("btnSort")?.addEventListener("click", () => {
    if (!selectedUserId) return;
    const sorted = listTasks.filter(t => t.userId === selectedUserId).sort((a, b) => a.title.localeCompare(b.title));
    renderTasks(sorted);
});

renderUsers();

const modalDetails = document.getElementById("userDetails") as HTMLElement;
const detailsContent = document.getElementById("detailsContent") as HTMLElement;
const btnCloseDetails = document.getElementById("closeDetails") as HTMLButtonElement;

function abrirModalDetalhes(user: User): void {
    const tarefasDoUsuario = listTasks.filter(t => t.userId === user.id);
    const concluidas = tarefasDoUsuario.filter(t => t.completed).length;

    detailsContent.innerHTML = `
        <div class="modal-info">
            <p><strong>Nome:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Status:</strong> ${user.active ? 'Ativo' : 'Inativo'}</p>
            <hr>
            <p><strong>Resumo de Atividade:</strong></p>
            <ul>
                <li>Total de Tarefas: ${tarefasDoUsuario.length}</li>
                <li>Concluídas: ${concluidas}</li>
                <li>Pendentes: ${tarefasDoUsuario.length - concluidas}</li>
            </ul>
        </div>
    `;

    modalDetails.style.display = "block";
}

btnCloseDetails.addEventListener("click", () => {
    modalDetails.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modalDetails) {
        modalDetails.style.display = "none";
    }
});


const errorModal = document.getElementById("errorModal") as HTMLDialogElement;
const confirmModal = document.getElementById("confirmModal") as HTMLDialogElement;

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
        confirmModal.onclose = () => resolve(false);
    });
}

document.getElementById("closeModal")?.addEventListener("click", () => {
    errorModal.close();
});

document.getElementById("btnClearCompleted")?.addEventListener("click", async () => {
    if (selectedUserId === null) {
        showModal("Selecione um utilizador primeiro para limpar as suas tarefas!");
        return;
    }

    const temConcluidas = listTasks.some(t => t.userId === selectedUserId && t.completed);

    if (!temConcluidas) {
        showModal("Não existem tarefas concluídas para este utilizador!");
        return;
    }

    const confirmado = await askConfirmation("Tem a certeza que deseja remover as tarefas?");
    
    if (confirmado) {
        listTasks = listTasks.filter(t => t.userId !== selectedUserId || !t.completed);
        renderTasks();
        renderUsers();
    }
});

const taskModal = document.getElementById("taskModal") as HTMLDialogElement;
const openModalBtn = document.getElementById("openModalBtn");
const btnCancelTask = document.getElementById("btnCancelTask");
const btnSaveTask = document.getElementById("btnSaveTask");

openModalBtn?.addEventListener("click", () => {
    if (!selectedUserId) {
        showModal("Selecione um utilizador primeiro!");
        return;
    }
    taskModal.showModal();
});



btnCancelTask?.addEventListener("click", () => {
    taskModal.close();
});

btnSaveTask?.addEventListener("click", () => {
    const categoryElem = document.getElementById("categorySelect") as HTMLSelectElement;
    const subjectElem = document.getElementById("subjectSelect") as HTMLSelectElement;
    const editTaskIdElem = document.getElementById("editTaskId") as HTMLInputElement; // Campo oculto que você adicionou no HTML

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
            listTasks.push({
                id: Date.now(),
                userId: selectedUserId!,
                title: newTaskInput.value,
                completed: false,
                category: cat,
                subject: sub
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

function openEditTask(id: number): void {
    const task = listTasks.find(t => t.id === id);
    if (!task) return;

    newTaskInput.value = task.title;

    (document.getElementById("categorySelect") as HTMLSelectElement).value = task.category;
    (document.getElementById("subjectSelect") as HTMLSelectElement).value = task.subject;

    (document.getElementById("editTaskId") as HTMLInputElement).value = id.toString();

    const modalTitle = document.querySelector("#taskModal h2");
    if (modalTitle) modalTitle.textContent = "Editar Tarefa";

    taskModal.showModal();
}



function openEditModal(taskId: number): void {
    const task = listTasks.find(t => t.id === taskId);
    
    if (!task) return;

    const editTaskIdElem = document.getElementById("editTaskId") as HTMLInputElement;
    const newTaskInput = document.getElementById("newTask") as HTMLTextAreaElement;

    newTaskInput.value = task.title;
    (document.getElementById("categorySelect") as HTMLSelectElement).value = task.category;
    (document.getElementById("subjectSelect") as HTMLSelectElement).value = task.subject;
    
    editTaskIdElem.value = taskId.toString();

    taskModal.showModal();
}





//Função para gerar Users Fakes
function loadInitialData(): void {

    const fakeData = [
        { id: 1, name: "Cynhtia", email: "cynthia@gmail.com", active: true },
        { id: 2, name: "Tais Dias", email: "tais.diasc@gmail.com", active: false },
        { id: 3, name: "Daniel Moraes", email: "daniel.moraesa@gmail.com", active: true },
        { id: 4, name: "Natalia", email: "natalia@gmail.com", active: true },
        { id: 5, name: "Debora", email: "debora@gmail.com", active: true },
        { id: 6, name: "Confuso", email: "muitoconfuso@hope.com", active: true}
    ];

    fakeData.forEach(data => {
        const newUser = new UserClass(data.id, data.name, data.email, data.active);
        listUsers.push(newUser);
    });

    renderUsers();
}

loadInitialData();
