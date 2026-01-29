import { UserClass, Task } from '../models/index.js';
import { listUsers, listTasks, selectedUserId, setListTasks, setSelectedUserId } from '../services/index.js';
import { renderUsers, renderTasks } from './index.js';
import { BugTask } from '../tasks/BugTask.js';
import { auditLog } from '../utils/HistoryLog.js';
import { deadlineService } from '../services/DeadlineService.js';
import { priorityService } from '../services/PriorityService.js';
import { Priority } from '../tasks/Priority.js';
import { assignmentService } from '../services/AssignmentService.js';
import { SearchService } from "../services/SearchService.js";
import { showModal, setUserSendoVisualizado, atualizarConteudoModal } from './modals.js';
let isAscending = true;
export function setupEventListeners() {
    const newTaskInput = document.getElementById("newTask");
    const taskModal = document.getElementById("taskModal");
    const modalDetails = document.getElementById("userDetails");
    const roleSelect = document.getElementById("role");
    const deadlineInput = document.getElementById("taskDeadline");
    const prioritySelect = document.getElementById("prioritySelect");
    const assignSelect = document.getElementById("assignSelect");
    const tagInput = document.getElementById("taskTag");
    const searchTitleInput = document.getElementById('search-title');
    const searchUserSelect = document.getElementById('search-user');
    const searchStatusSelect = document.getElementById('search-status');
    const userListContainer = document.getElementById("usersList");
    // --- PESQUISA E FILTROS (SearchService) ---
    const handleSearchServiceFilter = () => {
        const title = document.getElementById('search-title')?.value.trim() || "";
        const userRaw = document.getElementById('search-user')?.value || "";
        let userIdFiltered = undefined;
        if (userRaw) {
            const num = Number(userRaw);
            const userExists = num > 0 && listUsers.some(u => u.getId === num);
            if (!Number.isNaN(num) && userExists) {
                userIdFiltered = num;
            }
        }
        const statusVal = document.getElementById('search-status')?.value !== ""
            ? document.getElementById('search-status').value
            : undefined;
        const query = { text: title, userId: userIdFiltered, status: statusVal };
        const filteredTasks = SearchService.globalSearch(listTasks, query);
        if (userIdFiltered !== undefined) {
            setSelectedUserId(userIdFiltered);
            const selNameElem = document.getElementById("selectedUserName");
            const usr = listUsers.find(u => u.getId === userIdFiltered);
            if (selNameElem)
                selNameElem.textContent = usr ? usr.name : "Nenhum selecionado";
        }
        else if (filteredTasks.length > 0) {
            setSelectedUserId(filteredTasks[0].userId);
            const selNameElem = document.getElementById("selectedUserName");
            const usr = listUsers.find(u => u.getId === filteredTasks[0].userId);
            if (selNameElem)
                selNameElem.textContent = usr ? usr.name : "Nenhum selecionado";
        }
        else {
            setSelectedUserId(null);
            const selNameElem = document.getElementById("selectedUserName");
            if (selNameElem)
                selNameElem.textContent = "Nenhum selecionado";
        }
        renderTasks(filteredTasks, false);
    };
    searchTitleInput?.addEventListener('input', handleSearchServiceFilter);
    searchUserSelect?.addEventListener('change', handleSearchServiceFilter);
    searchStatusSelect?.addEventListener('change', handleSearchServiceFilter);
    // --- SELEÇÃO DE USUÁRIO E DETALHES ---
    userListContainer?.addEventListener("click", (e) => {
        const target = e.target;
        if (target.closest('button'))
            return;
        const card = target.closest(".user-card");
        if (card) {
            // CORREÇÃO VISUAL: Sincroniza a marcação verde
            document.querySelectorAll('.user-card.selected').forEach(c => {
                c.classList.remove('selected');
            });
            card.classList.add("selected");
            const userId = Number(card.getAttribute("data-id"));
            const user = listUsers.find(u => u.getId === userId);
            if (user) {
                setUserSendoVisualizado(user);
                setSelectedUserId(userId);
                const selNameElem = document.getElementById("selectedUserName");
                const selIdDisplay = document.getElementById("selectedUserIdDisplay");
                if (selNameElem)
                    selNameElem.textContent = user.name;
                if (selIdDisplay)
                    selIdDisplay.textContent = userId.toString();
                atualizarConteudoModal(user);
                if (modalDetails) {
                    modalDetails.classList.remove("details-overlay-hidden");
                    modalDetails.style.display = "flex";
                }
                renderTasks();
            }
        }
    });
    // ADICIONAR NOVO USUÁRIO
    document.getElementById("formAdd")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const erroDisplay = document.getElementById("erro");
        if (erroDisplay) {
            erroDisplay.innerHTML = "";
            erroDisplay.className = "";
        }
        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const roleValue = roleSelect.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (nameValue === "") {
            if (erroDisplay) {
                erroDisplay.innerHTML = 'Por favor, introduza o seu nome.';
                erroDisplay.className = "erro";
            }
            nameInput.focus();
            return;
        }
        if (!emailRegex.test(emailValue)) {
            if (erroDisplay) {
                erroDisplay.innerHTML = 'Introduza um endereço de e-mail válido (ex: nome@dominio.com)';
                erroDisplay.className = "erro";
            }
            emailInput.focus();
            return;
        }
        if (!roleValue) {
            if (erroDisplay) {
                erroDisplay.innerHTML = 'Por favor, selecione uma função.';
                erroDisplay.className = "erro";
            }
            roleSelect.focus();
            return;
        }
        try {
            const newId = listUsers.length > 0 ? Math.max(...listUsers.map(u => u.getId)) + 1 : 1;
            const newUser = new UserClass(newId, nameValue, emailValue, roleValue);
            listUsers.push(newUser);
            renderUsers(listUsers);
            e.target.reset();
            auditLog.addLog(`USUÁRIO ADICIONADO: ${nameValue}`);
        }
        catch (error) {
            if (erroDisplay) {
                erroDisplay.innerHTML = error.message;
                erroDisplay.className = "erro";
            }
        }
    });
    // BUSCA RÁPIDA DE USUÁRIOS
    const searchInput = document.getElementById("searchInput");
    searchInput?.addEventListener("input", (e) => {
        const val = e.target.value.toLowerCase();
        const filteredUsers = listUsers.filter(u => u.name.toLowerCase().includes(val));
        renderUsers(filteredUsers);
    });
    // FILTRO ATIVOS / INATIVOS
    let mostrandoAtivos = true;
    const btnFilterActive = document.getElementById("filterActive");
    btnFilterActive?.addEventListener("click", () => {
        if (mostrandoAtivos) {
            const inativos = listUsers.filter(u => !u.isActive());
            renderUsers(inativos);
            btnFilterActive.innerText = "Ativos";
            mostrandoAtivos = false;
        }
        else {
            const ativos = listUsers.filter(u => u.isActive());
            renderUsers(ativos);
            btnFilterActive.innerText = "Inativos";
            mostrandoAtivos = true;
        }
    });
    document.getElementById("showAll")?.addEventListener("click", () => renderUsers(listUsers));
    // ORDENAÇÃO DE USUÁRIOS
    let usersSortAscending = true;
    document.getElementById("sortName")?.addEventListener("click", (e) => {
        const sorted = [...listUsers].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA === nameB)
                return 0;
            return usersSortAscending ? (nameA < nameB ? -1 : 1) : (nameA > nameB ? -1 : 1);
        });
        usersSortAscending = !usersSortAscending;
        const btn = e.currentTarget;
        if (btn)
            btn.textContent = usersSortAscending ? "Nome A-Z" : "Nome Z-A";
        renderUsers(sorted);
    });
    // SALVAMENTO E EDIÇÃO DE TAREFAS
    document.getElementById("btnSaveTask")?.addEventListener("click", () => {
        const editTaskIdElem = document.getElementById("editTaskId");
        const categoryElem = document.getElementById("categorySelect");
        const subjectElem = document.getElementById("subjectSelect");
        const taskTypeElem = document.getElementById("taskTypeSelect");
        const taskIdStr = editTaskIdElem.value;
        const titulo = newTaskInput.value.trim();
        const tagValue = tagInput?.value.trim() || "";
        const prioridade = prioritySelect.value;
        if (titulo.length <= 3)
            return showModal("A descrição deve ter mais de 3 caracteres.");
        if (taskIdStr) {
            const idToEdit = parseInt(taskIdStr);
            const task = listTasks.find(t => t.id === idToEdit);
            if (task) {
                task.title = titulo;
                task.tag = tagValue;
                if (task instanceof Task) {
                    task.category = categoryElem.value;
                    task.subject = subjectElem.value;
                }
                priorityService.setPriority(task.id, Priority[prioridade]);
                if (deadlineInput.value)
                    deadlineService.setDeadline(task.id, new Date(deadlineInput.value));
                assignmentService.getUsersFromTask(task.id).forEach(uid => assignmentService.unassignUser(task.id, uid));
                const selectedIds = Array.from(assignSelect.selectedOptions).map(opt => parseInt(opt.value));
                if (!selectedIds.includes(task.userId))
                    selectedIds.push(task.userId);
                selectedIds.forEach(uid => assignmentService.assignUser(task.id, uid));
            }
        }
        else {
            if (selectedUserId === null)
                return showModal("Selecione um utilizador primeiro.");
            const novoId = Date.now();
            const nova = (taskTypeElem.value === "bug")
                ? new BugTask(novoId, titulo, selectedUserId)
                : new Task(novoId, selectedUserId, titulo, categoryElem.value, subjectElem.value);
            nova.tag = tagValue;
            priorityService.setPriority(novoId, Priority[prioridade]);
            if (deadlineInput.value)
                deadlineService.setDeadline(novoId, new Date(deadlineInput.value));
            const selectedIds = Array.from(assignSelect.selectedOptions).map(opt => parseInt(opt.value));
            if (!selectedIds.includes(selectedUserId)) {
                selectedIds.push(selectedUserId);
            }
            selectedIds.forEach(uid => {
                assignmentService.assignUser(novoId, uid);
            });
            listTasks.push(nova);
        }
        taskModal.close();
        renderTasks();
        renderUsers();
    });
    // PESQUISA GLOBAL
    const globalSearchInput = document.getElementById("globalSearchInput");
    const performSearch = () => {
        const query = globalSearchInput.value.toLowerCase();
        const filtered = listTasks.filter(t => t.title.toLowerCase().includes(query) ||
            (t.tag && t.tag.toLowerCase().includes(query)));
        renderTasks(filtered);
    };
    document.getElementById("btnSearch")?.addEventListener("click", performSearch);
    globalSearchInput?.addEventListener("keypress", (e) => { if (e.key === 'Enter')
        performSearch(); });
    // LIMPAR TAREFAS CONCLUÍDAS
    document.getElementById("btnClearCompleted")?.addEventListener("click", () => {
        if (!confirm("Remover tarefas concluídas?"))
            return;
        const remaining = listTasks.filter(t => !t.completed);
        setListTasks(remaining);
        renderTasks();
        renderUsers();
    });
    // ORDENAÇÃO DE TAREFAS
    document.getElementById("btnSort")?.addEventListener("click", (e) => {
        listTasks.sort((a, b) => {
            const ta = a.title.toLowerCase();
            const tb = b.title.toLowerCase();
            if (ta === tb)
                return 0;
            return isAscending ? (ta < tb ? -1 : 1) : (ta > tb ? -1 : 1);
        });
        isAscending = !isAscending;
        const btn = e.currentTarget;
        if (btn)
            btn.textContent = isAscending ? "Ordenar A-Z" : "Ordenar Z-A";
        renderTasks();
    });
    // CONTROLE DE MODAIS
    document.getElementById("openModalBtn")?.addEventListener("click", () => {
        if (selectedUserId === null)
            return showModal("Por favor, selecione um utilizador primeiro!");
        document.getElementById("editTaskId").value = "";
        newTaskInput.value = "";
        if (tagInput)
            tagInput.value = "";
        deadlineInput.value = "";
        if (assignSelect) {
            const others = listUsers.filter(u => u.getId !== selectedUserId);
            assignSelect.innerHTML = others.map(u => `
                <option value="${u.getId}">${u.name} (${u.isActive() ? 'Ativo' : 'Inativo'})</option>
            `).join("");
        }
        taskModal.showModal();
    });
    window.abrirModalEdicao = (task) => {
        document.getElementById("editTaskId").value = task.id.toString();
        newTaskInput.value = task.title;
        if (tagInput)
            tagInput.value = task.tag || "";
        if (assignSelect) {
            const others = listUsers.filter(u => u.getId !== task.userId);
            assignSelect.innerHTML = others.map(u => `
                <option value="${u.getId}">${u.name}</option>
            `).join("");
        }
        updateAssignSelect(task.id);
        taskModal.showModal();
    };
    document.querySelectorAll(".btnCloseModal, #closeDetails, #closeModal, #btnCancelTask").forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest("dialog") || modalDetails;
            if (modal instanceof HTMLDialogElement)
                modal.close();
            else
                modal.style.display = "none";
        });
    });
}
export function updateAssignSelect(taskId) {
    const assignSelect = document.getElementById("assignSelect");
    if (!assignSelect)
        return;
    assignmentService.getUsersFromTask(taskId).forEach(uid => {
        const opt = assignSelect.querySelector(`option[value="${uid}"]`);
        if (opt)
            opt.selected = true;
    });
}
