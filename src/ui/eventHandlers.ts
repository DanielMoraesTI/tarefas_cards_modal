import { UserClass, Task } from '../models/index.js';
import { 
    listUsers, 
    listTasks, 
    selectedUserId, 
    setListTasks, 
    setSelectedUserId 
} from '../services/index.js';
import { 
    renderUsers, 
    renderTasks, 
    renderDashboard,
    updateExtendedStatistics
} from './index.js';
import { BugTask } from '../tasks/BugTask.js';
import { SystemLogger } from '../logs/SystemLogger.js';
import { deadlineService } from '../services/DeadlineService.js';
import { priorityService } from '../services/PriorityService.js';
import { Priority } from '../tasks/Priority.js';
import { assignmentService } from '../services/AssignmentService.js';
import { SearchService } from "../services/SearchService.js";
import { showModal, setUserSendoVisualizado, atualizarConteudoModal } from './modals.js';
import { automationRulesService } from '../services/AutomationRulesService.js';
import { BusinessRules } from '../services/BusinessRules.js';
import { TaskStatus } from '../tasks/TaskStatus.js';
import { UserRole } from '../security/UserRole.js';
import { IdGenerator } from '../utils/IdGenerator.js';


// Variáveis globais para controle de ordenação/filtros
let isAscending = true;
let isUserAscending = true;
let isTaskAscending = true;
let showingActive = true;


export function setupEventListeners() {
    const newTaskInput = document.getElementById("newTask") as HTMLTextAreaElement;
    const taskModal = document.getElementById("taskModal") as HTMLDialogElement;
    const modalDetails = document.getElementById("userDetails");
    const roleSelect = document.getElementById("role") as HTMLSelectElement;
    const deadlineInput = document.getElementById("taskDeadline") as HTMLInputElement;
    const prioritySelect = document.getElementById("prioritySelect") as HTMLSelectElement;
    const assignSelect = document.getElementById("assignSelect") as HTMLSelectElement;
    
    const searchTitleInput = document.getElementById('search-title') as HTMLInputElement;
    const searchUserSelect = document.getElementById('search-user') as HTMLSelectElement;
    const searchStatusSelect = document.getElementById('search-status') as HTMLSelectElement;
    
    const userListContainer = document.getElementById("usersList");

    // PESQUISA E FILTROS (SearchService)
    const handleSearchServiceFilter = () => {
        const title = searchTitleInput?.value.trim() || "";
        const userRaw = searchUserSelect?.value || "";
        
        let userIdFiltered: number | undefined = undefined;
        if (userRaw) {
            const num = Number(userRaw);
            const userExists = num > 0 && listUsers.some(u => u.getId === num);
            if (!Number.isNaN(num) && userExists) {
                userIdFiltered = num;
            }
        }

        const statusVal = searchStatusSelect?.value;
        let statusFiltered: TaskStatus | undefined = undefined;
        
        if (statusVal && statusVal !== "") {
            if (statusVal === "Aberta") {
                statusFiltered = TaskStatus.CREATED;
            } else if (statusVal === "Concluída") {
                statusFiltered = TaskStatus.COMPLETED;
            }
        }

        const query = { text: title, userId: userIdFiltered, status: statusFiltered };
        const filteredTasks = SearchService.globalSearch(listTasks, query);

        if (userIdFiltered !== undefined) {
            setSelectedUserId(userIdFiltered);
            const selNameElem = document.getElementById("selectedUserName");
            const usr = listUsers.find(u => u.getId === userIdFiltered);
            if (selNameElem) selNameElem.textContent = usr ? usr.name : "Nenhum selecionado";
            
            updateExtendedStatistics();
        }

        renderTasks(filteredTasks as Task[], false);
    };

    // CLIQUE NO CARD DE USUÁRIO
    userListContainer?.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        
        if (target.closest('button')) return;

        const card = target.closest(".user-card") as HTMLElement;
        if (card) {
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

                if (selNameElem) selNameElem.textContent = user.name;
                if (selIdDisplay) selIdDisplay.textContent = userId.toString();

                atualizarConteudoModal(user);

                if (modalDetails) {
                    modalDetails.classList.remove("details-overlay-hidden");
                    modalDetails.style.display = "flex";
                }

                renderTasks();
                updateExtendedStatistics();
            }
        }
    });

    searchTitleInput?.addEventListener('input', handleSearchServiceFilter);
    searchUserSelect?.addEventListener('change', handleSearchServiceFilter);
    searchStatusSelect?.addEventListener('change', handleSearchServiceFilter);

    // ADICIONAR USUÁRIO
    document.getElementById("formAdd")?.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById("name") as HTMLInputElement;
        const emailInput = document.getElementById("email") as HTMLInputElement;
        const erroSpan = document.getElementById("erro");

        const userName = nameInput.value.trim();
        const userEmail = emailInput.value.trim();
        const userRole = roleSelect?.value;

        // Limpar erro anterior
        if (erroSpan) {
            erroSpan.innerHTML = "";
        }

        // VALIDAÇÃO 1: Nome vazio
        if (!userName) {
            if (erroSpan) {
                erroSpan.innerHTML = '<strong style="color: #e74c3c; font-weight: bold;">❌ O campo Nome é obrigatório.</strong>';
            }
            return;
        }

        // VALIDAÇÃO 2: Nome mínimo 3 caracteres
        if (userName.length < 3) {
            if (erroSpan) {
                erroSpan.innerHTML = '<strong style="color: #e74c3c; font-weight: bold;">❌ O Nome deve ter pelo menos 3 caracteres.</strong>';
            }
            return;
        }

        // VALIDAÇÃO 3: Nome só letras e espaços
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
        if (!nameRegex.test(userName)) {
            if (erroSpan) {
                erroSpan.innerHTML = '<strong style="color: #e74c3c; font-weight: bold;">❌ O Nome só pode conter letras e espaços.</strong>';
            }
            return;
        }

        // VALIDAÇÃO 4: Email vazio
        if (!userEmail) {
            if (erroSpan) {
                erroSpan.innerHTML = '<strong style="color: #e74c3c; font-weight: bold;">❌ O campo E-mail é obrigatório.</strong>';
            }
            return;
        }

        // VALIDAÇÃO 5: Email formato válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            if (erroSpan) {
                erroSpan.innerHTML = '<strong style="color: #e74c3c; font-weight: bold;">❌ Por favor, insira um E-mail válido (exemplo: usuario@dominio.com).</strong>';
            }
            return;
        }

        // VALIDAÇÃO 6: Função não selecionada
        if (!userRole) {
            if (erroSpan) {
                erroSpan.innerHTML = '<strong style="color: #e74c3c; font-weight: bold;">❌ Por favor, selecione uma Função para o utilizador.</strong>';
            }
            return;
        }

        // VALIDAÇÃO 7: Email já existe
        const emailExists = listUsers.some(u => u.getEmail().toLowerCase() === userEmail.toLowerCase());
        if (emailExists) {
            if (erroSpan) {
                erroSpan.innerHTML = '<strong style="color: #e74c3c; font-weight: bold;">❌ Este E-mail já está cadastrado no sistema.</strong>';
            }
            return;
        }

        // Se chegou aqui, criar usuário
        const newUserId = IdGenerator.generate();
        const newUser = new UserClass(newUserId, userName, userEmail, userRole as UserRole);
        listUsers.push(newUser);

        SystemLogger.log(`[User] Novo utilizador criado: ${userName} (${userEmail})`);

        // Limpar formulário
        nameInput.value = "";
        emailInput.value = "";
        if (roleSelect) roleSelect.value = "";
        if (erroSpan) erroSpan.innerHTML = "";

        renderUsers();
        updateExtendedStatistics();

        // Mensagem de sucesso
        if (erroSpan) {
            erroSpan.innerHTML = '<strong style="color: #27ae60; font-weight: bold;">✅ Utilizador criado com sucesso!</strong>';
            setTimeout(() => {
                if (erroSpan) erroSpan.innerHTML = "";
            }, 3000);
        }
    });

    // SALVAR TAREFA
    document.getElementById("btnSaveTask")?.addEventListener("click", () => {
        const editTaskIdElem = document.getElementById("editTaskId") as HTMLInputElement;
        const taskText = newTaskInput?.value.trim();

        if (!taskText || !BusinessRules.isValidTitle(taskText)) {
            showModal("A tarefa deve ter pelo menos 3 caracteres.");
            return;
        }

        if (!selectedUserId) {
            showModal("Selecione um utilizador antes de criar a tarefa.");
            return;
        }

        const editId = editTaskIdElem?.value ? Number(editTaskIdElem.value) : null;

        if (editId !== null) {
            // EDIÇÃO DE TAREFA EXISTENTE
            const task = listTasks.find(t => t.id === editId);
            if (task) {
                task.title = taskText;
                
                if (deadlineInput?.value) {
                    const deadlineDate = new Date(deadlineInput.value);
                    deadlineService.setDeadline(task.id, deadlineDate);
                }

                const newPriority = prioritySelect?.value as Priority;
                if (newPriority) {
                    priorityService.setPriority(task.id, newPriority);
                }

                const selectedUserIds = Array.from(assignSelect?.selectedOptions || [])
                    .map((opt: HTMLOptionElement) => Number(opt.value))
                    .filter(id => !isNaN(id));

                const currentAssignments = assignmentService.getUsersFromTask(task.id);
                currentAssignments.forEach(uid => {
                    assignmentService.unassignUser(task.id, uid);
                });

                selectedUserIds.forEach(uid => {
                    const usr = listUsers.find(u => u.getId === uid);
                    if (usr && BusinessRules.canAssignTask(usr.isActive())) {
                        assignmentService.assignUser(task.id, uid);
                    }
                });

                SystemLogger.log(`[Task] Tarefa editada: ${task.title}`);
            }
        } else {
            // NOVA TAREFA
            const typeVal = (document.getElementById("taskTypeSelect") as HTMLSelectElement)?.value;
            
            let newTask: Task | BugTask;
            
            if (typeVal === "bug") {
                newTask = new BugTask(taskText, selectedUserId);
            } else {
                const categoryVal = (document.getElementById("categorySelect") as HTMLSelectElement)?.value || "Audiência";
                const subjectVal = (document.getElementById("subjectSelect") as HTMLSelectElement)?.value || "Civil";
                
                newTask = new Task(taskText, selectedUserId, categoryVal as any, subjectVal as any);
            }

            listTasks.push(newTask);

            if (deadlineInput?.value) {
                const deadlineDate = new Date(deadlineInput.value);
                deadlineService.setDeadline(newTask.id, deadlineDate);
            }

            const newPriority = prioritySelect?.value as Priority;
            if (newPriority) {
                priorityService.setPriority(newTask.id, newPriority);
            }

            const selectedUserIds = Array.from(assignSelect?.selectedOptions || [])
                .map((opt: HTMLOptionElement) => Number(opt.value))
                .filter(id => !isNaN(id));

            selectedUserIds.forEach(uid => {
                const usr = listUsers.find(u => u.getId === uid);
                if (usr && BusinessRules.canAssignTask(usr.isActive())) {
                    assignmentService.assignUser(newTask.id, uid);
                }
            });

            SystemLogger.log(`[Task] Nova tarefa criada: ${newTask.title}`);
        }

        if (taskModal) taskModal.close();
        if (newTaskInput) newTaskInput.value = "";
        if (editTaskIdElem) editTaskIdElem.value = "";
        if (deadlineInput) deadlineInput.value = "";
        
        renderTasks();
        renderUsers();
        renderDashboard();
        updateExtendedStatistics();
    });

    // OUTROS EVENT LISTENERS
    document.getElementById("openModalBtn")?.addEventListener("click", () => {
        const editTaskIdElem = document.getElementById("editTaskId") as HTMLInputElement;
        if (editTaskIdElem) editTaskIdElem.value = "";
        if (newTaskInput) newTaskInput.value = "";
        if (deadlineInput) deadlineInput.value = "";
        if (taskModal) taskModal.showModal();
    });

    document.getElementById("btnCancelTask")?.addEventListener("click", () => {
        if (taskModal) taskModal.close();
    });

    document.getElementById("closeDetails")?.addEventListener("click", () => {
        if (modalDetails) {
            modalDetails.classList.add("details-overlay-hidden");
            modalDetails.style.display = "none";
        }
    });

    document.getElementById("closeModal")?.addEventListener("click", () => {
        const errorModal = document.getElementById("errorModal") as HTMLDialogElement;
        if (errorModal) errorModal.close();
    });

    document.getElementById("btnClearCompleted")?.addEventListener("click", () => {
        if (selectedUserId === null) {
            showModal("Selecione um utilizador primeiro.");
            return;
        }
        
        const currentUserId = selectedUserId;
        
        const remaining = listTasks.filter(t => {
            const belongsToUser = t.userId === currentUserId || 
                                  assignmentService.getUsersFromTask(t.id).includes(currentUserId);
            return !(belongsToUser && t.completed);
        });

        setListTasks(remaining);
        renderTasks();
        renderUsers();
        updateExtendedStatistics();
    });

    document.getElementById("btnSort")?.addEventListener("click", () => {
        const btn = document.getElementById("btnSort");
        
        const sorted = [...listTasks].sort((a, b) => {
            return isTaskAscending 
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        });
        
        isTaskAscending = !isTaskAscending;
        
        if (btn) {
            btn.textContent = isTaskAscending ? "Ordenar A-Z" : "Ordenar Z-A";
        }
        
        renderTasks(sorted as Task[], false);
    });

    // FILTROS DE USUÁRIOS - Busca por nome/email
    const searchInputElement = document.getElementById("searchInput") as HTMLInputElement;
    
    searchInputElement?.addEventListener("input", (e) => {
        const term = (e.target as HTMLInputElement).value.toLowerCase().trim();
        
        if (term === "") {
            showingActive = true;
            const btnFilter = document.getElementById("filterActive");
            if (btnFilter) btnFilter.textContent = "Ativos";
            renderUsers();
        } else {
            const filtered = listUsers.filter(u => 
                u.name.toLowerCase().includes(term) || 
                u.getEmail().toLowerCase().includes(term)
            );
            renderUsers(filtered);
        }
    });

    // Botão: Ativos / Inativos (alterna entre mostrar ativos e inativos)
    document.getElementById("filterActive")?.addEventListener("click", () => {
        if (searchInputElement) searchInputElement.value = "";
        
        const btn = document.getElementById("filterActive");
        
        if (showingActive) {
            const inactive = listUsers.filter(u => !u.isActive());
            renderUsers(inactive);
            if (btn) btn.textContent = "Ativos";
        } else {
            const active = listUsers.filter(u => u.isActive());
            renderUsers(active);
            if (btn) btn.textContent = "Inativos";
        }
        
        showingActive = !showingActive;
    });

    // Botão: Todos (sempre mostra todos os usuários)
    document.getElementById("showAll")?.addEventListener("click", () => {
        if (searchInputElement) searchInputElement.value = "";
        
        renderUsers();
        
        showingActive = true;
        const btnFilter = document.getElementById("filterActive");
        if (btnFilter) btnFilter.textContent = "Ativos";
    });

    // Botão: Nome A-Z / Nome Z-A
    document.getElementById("sortName")?.addEventListener("click", () => {
        if (searchInputElement) searchInputElement.value = "";
        
        const btn = document.getElementById("sortName");
        
        const sorted = [...listUsers].sort((a, b) => {
            return isUserAscending
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });
        
        isUserAscending = !isUserAscending;
        
        if (btn) {
            btn.textContent = isUserAscending ? "Nome A-Z" : "Nome Z-A";
        }
        
        renderUsers(sorted);
    });

    document.getElementById("btnClearFilter")?.addEventListener("click", () => {
        renderTasks(undefined, true);
    });
}
