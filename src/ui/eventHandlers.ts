import { UserClass, Task } from '../models/index.js';
import { 
    listUsers, 
    listTasks, 
    selectedUserId, 
    setListTasks, 
    setSelectedUserId,
    createUserBackend,
    createTaskBackend,
    updateTaskBackend,
    deleteTaskLogic,
    TagService,
    reloadAllTagsForUser
} from '../services/index.js';
import { apiUserService } from '../api/apiUserService.js';
import { apiTaskService } from '../api/apiTaskService.js';
import { apiTagService } from '../api/apiTagService.js';
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

    // PESQUISA E FILTROS - SIMPLIFICADO
    const handleSearchServiceFilter = async () => {
        try {
            const title = searchTitleInput?.value.trim() || "";
            const userRaw = searchUserSelect?.value || "";
            const statusVal = searchStatusSelect?.value || "";
            
            // Buscar tarefas do backend (com título se houver)
            const backendTasks = await apiTaskService.getAllTasks(title);
            
            if (!Array.isArray(backendTasks)) {
                console.error('Erro: backend não retornou array');
                return;
            }
            
            // Converter para Task
            const convertedTasks = backendTasks.map((taskData: any) => {
                const workCat = ['Audiência', 'Atendimento', 'Análise'].includes(taskData.categoria) 
                    ? taskData.categoria 
                    : 'Audiência';
                
                const task = new Task(
                    taskData.title,
                    taskData.user_id || 0,
                    workCat as any,
                    'Civil' as any,
                    taskData.id
                );
                
                if (taskData.concluida) {
                    (task as any).completed = true;
                }
                
                (task as any).responsavelNome = taskData.responsavelNome;
                (task as any).dataConclusao = taskData.dataConclusao;
                // ✅ IMPORTANTE: Deep copy de tags para evitar compartilhamento
                if (Array.isArray(taskData.tags)) {
                    (task as any).tags = taskData.tags.map((t: any) => ({
                        id: t.id,
                        name: t.name,
                        color: t.color || '#9b59b6'
                    }));
                } else {
                    (task as any).tags = [];
                }
                
                return task;
            });
            
            // Sincronizar listTasks
            setListTasks(convertedTasks);
            
            // Filtrar por usuário (se selecionado)
            let result = convertedTasks;
            if (userRaw !== "") {
                const userIdNum = Number(userRaw);
                if (!isNaN(userIdNum) && userIdNum > 0) {
                    result = result.filter((t: Task) => t.userId === userIdNum);
                    setSelectedUserId(userIdNum);
                    
                    const selNameElem = document.getElementById("selectedUserName");
                    const usr = listUsers.find(u => u.getId === userIdNum);
                    if (selNameElem) selNameElem.textContent = usr ? usr.name : "Nenhum selecionado";
                    updateExtendedStatistics();
                    
                    // Recarregar tags em background
                    setTimeout(() => {
                        reloadAllTagsForUser(userIdNum).then(() => {
                            renderTasks(undefined, false);
                        });
                    }, 100);
                }
            } else {
                // Nenhum usuário selecionado = mostrar TODOS
                setSelectedUserId(null);
                
                const selNameElem = document.getElementById("selectedUserName");
                if (selNameElem) selNameElem.textContent = "Todos os Utilizadores";
                
                const selectedUserIdDisplay = document.getElementById("selectedUserIdDisplay");
                if (selectedUserIdDisplay) selectedUserIdDisplay.textContent = "Todos";
                
                // Recarregar tags para TODOS em background
                setTimeout(() => {
                    reloadAllTagsForUser(0).then(() => {
                        renderTasks(undefined, false);
                    });
                }, 100);
            }
            
            // Filtrar por status (se selecionado)
            if (statusVal === "Aberta") {
                result = result.filter((t: Task) => !t.completed);
            } else if (statusVal === "Concluída") {
                result = result.filter((t: Task) => t.completed);
            }
            
            // Renderizar (com resultado já filtrado por usuário/status)
            renderTasks(result as Task[], false);
        } catch (error) {
            console.error('Erro ao filtrar tarefas:', error);
        }
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
    document.getElementById("formAdd")?.addEventListener("submit", async (e) => {
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

        // Criar usuário no backend
        try {
            const newUserData = await createUserBackend({ 
                name: userName, 
                email: userEmail, 
                role: userRole as UserRole
            } as any);
            
            if (!newUserData) {
                if (erroSpan) {
                    erroSpan.innerHTML = '<strong style="color: #e74c3c; font-weight: bold;">❌ Erro ao criar utilizador. Tente novamente.</strong>';
                }
                return;
            }

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
        } catch (error) {
            console.error('Erro ao criar utilizador:', error);
            if (erroSpan) {
                erroSpan.innerHTML = '<strong style="color: #e74c3c; font-weight: bold;">❌ Erro ao criar utilizador. Tente novamente.</strong>';
            }
        }
    });

    // SALVAR TAREFA
    document.getElementById("btnSaveTask")?.addEventListener("click", async () => {
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
            const categoryVal = (document.getElementById("categorySelect") as HTMLSelectElement)?.value || "Audiência";
            const updates: any = {
                title: taskText,
                categoria: categoryVal,
                concluida: false
            };

            if (deadlineInput?.value) {
                updates.dataConclusao = deadlineInput.value;
            }

            try {
                await updateTaskBackend(editId, updates);
                
                // Atualizar propriedades locais
                const task = listTasks.find(t => t.id === editId);
                if (task) {
                    (task as any).title = taskText;
                    
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

                    // Limpar atribuições antigas
                    const currentAssignments = assignmentService.getUsersFromTask(task.id);
                    currentAssignments.forEach(uid => {
                        assignmentService.unassignUser(task.id, uid);
                    });

                    // Atribuir localmente a TODOS os usuários selecionados
                    selectedUserIds.forEach(uid => {
                        const usr = listUsers.find(u => u.getId === uid);
                        if (usr && BusinessRules.canAssignTask(usr.isActive())) {
                            assignmentService.assignUser(task.id, uid);
                        }
                    });

                    // Atualizar backend com o primeiro usuário atribuído
                    if (selectedUserIds.length > 0) {
                        const primaryAssigneeId = selectedUserIds[0];
                        const primaryUser = listUsers.find(u => u.getId === primaryAssigneeId);
                        if (primaryUser) {
                            await updateTaskBackend(editId, {
                                user_id: primaryAssigneeId,
                                responsavelNome: primaryUser.name
                            });
                        }
                    }

                    SystemLogger.log(`[Task] Tarefa editada no backend: ${task.title}`);
                }

                showModal("✅ Tarefa atualizada com sucesso!");
            } catch (error) {
                console.error('Erro ao atualizar tarefa:', error);
                showModal("❌ Erro ao atualizar tarefa. Tente novamente.");
            }
        } else {
            // NOVA TAREFA - integrada com backend
            const categoryVal = (document.getElementById("categorySelect") as HTMLSelectElement)?.value || "Audiência";

            try {
                const newTask = await createTaskBackend(taskText, categoryVal, selectedUserId);
                
                if (newTask) {
                    // Encontrar a tarefa criada em listTasks
                    const taskObj = listTasks.find(t => t.id === newTask.id);
                    if (taskObj) {
                        // Aplicar prioridade
                        const newPriority = prioritySelect?.value as Priority;
                        if (newPriority) {
                            priorityService.setPriority(taskObj.id, newPriority);
                        }

                        // Aplicar atribuições de colaboradores
                        const selectedUserIds = Array.from(assignSelect?.selectedOptions || [])
                            .map((opt: HTMLOptionElement) => Number(opt.value))
                            .filter(id => !isNaN(id));

                        // Atribuir localmente a TODOS os usuários selecionados
                        selectedUserIds.forEach(uid => {
                            const usr = listUsers.find(u => u.getId === uid);
                            if (usr && BusinessRules.canAssignTask(usr.isActive())) {
                                assignmentService.assignUser(taskObj.id, uid);
                            }
                        });

                        // Se há atribuições, atualizar o backend com o primeiro usuário atribuído
                        if (selectedUserIds.length > 0) {
                            const primaryAssigneeId = selectedUserIds[0];
                            const primaryUser = listUsers.find(u => u.getId === primaryAssigneeId);
                            
                            if (primaryUser) {
                                try {
                                    await updateTaskBackend(newTask.id, {
                                        user_id: primaryAssigneeId,
                                        responsavelNome: primaryUser.name
                                    });
                                } catch (error) {
                                    console.error('Erro ao atualizar atribuição no backend:', error);
                                }
                            }
                        }

                        // Aplicar deadline
                        if (deadlineInput?.value) {
                            const deadlineDate = new Date(deadlineInput.value);
                            deadlineService.setDeadline(taskObj.id, deadlineDate);
                        }
                    }

                    SystemLogger.log(`[Task] Nova tarefa criada no backend: ${taskText}`);
                    showModal("✅ Tarefa criada com sucesso!");
                }
            } catch (error) {
                console.error('Erro ao criar tarefa:', error);
                showModal("❌ Erro ao criar tarefa. Tente novamente.");
            }
        }

        if (taskModal) taskModal.close();
        if (newTaskInput) newTaskInput.value = "";
        if (editTaskIdElem) editTaskIdElem.value = "";
        if (deadlineInput) deadlineInput.value = "";
        
        // Renderizar com delay para garantir que as propriedades foram aplicadas
        setTimeout(() => {
            renderTasks(undefined, false);
            renderUsers();
            renderDashboard();
            updateExtendedStatistics();
        }, 100);
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

    document.getElementById("btnSort")?.addEventListener("click", async () => {
        const btn = document.getElementById("btnSort");
        
        // Calcular parâmetro de ordenação para backend
        const sortParam = isTaskAscending ? 'desc' : 'asc';
        
        try {
            // Buscar tarefas do backend com ordenação
            const tasksFromBackend = await apiTaskService.getAllTasks('', sortParam);
            
            if (Array.isArray(tasksFromBackend)) {
                // Converter dados do backend para Task
                const convertedTasks = tasksFromBackend.map((taskData: any) => {
                    const workCat = ['Audiência', 'Atendimento', 'Análise'].includes(taskData.categoria) 
                        ? taskData.categoria 
                        : 'Audiência';
                    
                    const task = new Task(
                        taskData.title,
                        taskData.user_id || 0,
                        workCat as any,
                        'Civil' as any,
                        taskData.id
                    );
                    
                    if (taskData.concluida) {
                        (task as any).completed = true;
                        (task as any).completionDate = taskData.dataConclusao;
                    }
                    
                    (task as any).responsavelNome = taskData.responsavelNome;
                    (task as any).dataConclusao = taskData.dataConclusao;
                    
                    return task;
                });
                
                // Sincronizar com listTasks
                setListTasks(convertedTasks);
            }
        } catch (error) {
            console.error('Erro ao ordenar tarefas:', error);
        }
        
        isTaskAscending = !isTaskAscending;
        
        if (btn) {
            btn.textContent = isTaskAscending ? "Ordenar A-Z" : "Ordenar Z-A";
        }
        
        // Renderizar apenas as tarefas do usuário selecionado
        renderTasks(undefined, false);
    });

    // FILTROS DE USUÁRIOS - Busca por nome/email
    const searchInputElement = document.getElementById("searchInput") as HTMLInputElement;
    
    searchInputElement?.addEventListener("input", async (e) => {
        const term = (e.target as HTMLInputElement).value.trim();
        
        if (term === "") {
            // Se vazio, carrega todos do backend
            showingActive = true;
            const btnFilter = document.getElementById("filterActive");
            if (btnFilter) btnFilter.textContent = "Ativos";
            
            const allUsers = await apiUserService.getAllUsers();
            if (allUsers && Array.isArray(allUsers)) {
                listUsers.splice(0, listUsers.length);
                allUsers.forEach((userData: any) => {
                    const user = new UserClass(userData.id, userData.name, userData.email, userData.role || 'USER');
                    if (!userData.ativo) user.toggleActive();
                    listUsers.push(user);
                });
            }
            renderUsers();
        } else {
            // Com termo de busca, chama backend com search
            const results = await apiUserService.getAllUsers(term);
            if (results && Array.isArray(results)) {
                renderUsers(results.map((userData: any) => {
                    const user = new UserClass(userData.id, userData.name, userData.email, userData.role || 'USER');
                    if (!userData.ativo) user.toggleActive();
                    return user;
                }));
            }
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
    document.getElementById("sortName")?.addEventListener("click", async () => {
        if (searchInputElement) searchInputElement.value = "";
        
        const btn = document.getElementById("sortName");
        const sortParam = isUserAscending ? 'desc' : 'asc';
        
        const sorted = await apiUserService.getAllUsers('', sortParam);
        
        if (sorted && Array.isArray(sorted)) {
            listUsers.splice(0, listUsers.length);
            sorted.forEach((userData: any) => {
                const user = new UserClass(userData.id, userData.name, userData.email, userData.role || 'USER');
                if (!userData.ativo) user.toggleActive();
                listUsers.push(user);
            });
        }
        
        isUserAscending = !isUserAscending;
        
        if (btn) {
            btn.textContent = isUserAscending ? "Nome A-Z" : "Nome Z-A";
        }
        
        renderUsers();
    });

    document.getElementById("btnClearFilter")?.addEventListener("click", () => {
        renderTasks(undefined, true);
    });

    // Listeners para funcionalidades de TAGS (Backend)
    const tagService = new TagService();

    // Delegação: Adicionar tag a uma tarefa (assumindo que há um elemento data-task-id no modal)
    document.addEventListener("click", async (e) => {
        const target = e.target as HTMLElement;

        // Botão para adicionar tag (presumindo data-task-id no DOM)
        if (target.classList.contains("btnAddTagToTask")) {
            try {
                const taskId = Number(target.getAttribute("data-task-id"));
                const tagId = Number((target.closest("div")?.querySelector("input[data-tag-id]") as HTMLInputElement)?.value);

                if (!taskId || !tagId || isNaN(taskId) || isNaN(tagId)) {
                    return;
                }

                await tagService.addTag(taskId, tagId);
                SystemLogger.log(`[Tag] Tag ${tagId} adicionada à tarefa ${taskId}`);
                renderTasks(undefined, false);
            } catch (error) {
                console.error('[EventHandlers] Erro ao adicionar tag:', error);
            }
        }

        // Botão para criar nova tag (assumindo input com class "newTagInput")
        if (target.classList.contains("btnCreateNewTag")) {
            try {
                const input = target.closest("div")?.querySelector("input.newTagInput") as HTMLInputElement;
                const colorPicker = target.closest("div")?.querySelector("input[type='color'][data-tag-color]") as HTMLInputElement;

                if (!input || !input.value.trim()) {
                    return;
                }

                const newTag = await tagService.createTag(input.value.trim(), colorPicker?.value || '#9b59b6');
                
                if (newTag) {
                    input.value = "";
                    SystemLogger.log(`[Tag] Tag criada: ${newTag.name}`);
                    renderTasks(undefined, false);
                }
            } catch (error) {
                console.error('[EventHandlers] Erro ao criar tag:', error);
            }
        }
    });
}
