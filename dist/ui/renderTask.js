import { Task } from '../models/task.js';
import { listTasks, selectedUserId, listUsers, assignmentService, deadlineService, priorityService, CommentService, AttachmentService, TagService, deleteTaskLogic, reloadAllTagsForUser } from '../services/index.js';
import { renderUsers } from './renderUser.js';
import { TaskStatus } from '../tasks/TaskStatus.js';
import { canDeleteTask, canEditTask } from '../security/permissions.js';
import { Priority } from '../tasks/Priority.js';
import { automationRulesService } from '../services/AutomationRulesService.js';
const taskListUI = document.getElementById("taskList");
const searchInput = document.getElementById("searchTask");
const commentService = new CommentService();
const attachmentService = new AttachmentService();
const tagService = new TagService();
let activeTagFilter = null; // Agora usa ID da tag
let currentSearchTerm = "";
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        renderTasks(undefined, false);
    });
}
/**
 * Renderiza tarefas filtradas do usuário selecionado
 * @param arrayToRender - Array opcional de tarefas a renderizar
 * @param resetFilters - Se true, reseta filtros de busca e tags
 */
export function renderTasks(arrayToRender, resetFilters = true) {
    if (!taskListUI)
        return;
    if (resetFilters && !arrayToRender) {
        activeTagFilter = null;
        currentSearchTerm = "";
        if (searchInput)
            searchInput.value = "";
    }
    taskListUI.innerHTML = "";
    // Se selectedUserId é null, mostrar TODAS as tarefas
    // Se selectedUserId tem valor, mostrar tarefas do usuário específico
    let tasksToShow;
    let currentUser = null;
    let userRole = null;
    if (selectedUserId === null) {
        // Mostrar TODAS as tarefas
        tasksToShow = arrayToRender || listTasks;
    }
    else {
        // Mostrar tarefas do usuário específico
        currentUser = listUsers.find(u => u.getId === selectedUserId);
        userRole = currentUser ? currentUser.getRole() : null;
        tasksToShow = arrayToRender || listTasks.filter(t => t.userId === selectedUserId || assignmentService.getUsersFromTask(t.id).includes(selectedUserId));
    }
    // AUTOMAÇÃO: Aplicar regras globais (como expiração) antes de renderizar
    tasksToShow.forEach(task => automationRulesService.applyRules(task));
    // Coletar todas as tags DAS TAREFAS visíveis, evitando duplicatas por ID
    const allTagsMap = new Map();
    tasksToShow.forEach(t => {
        const taskTags = t.tags || [];
        taskTags.forEach((tag) => {
            if (!allTagsMap.has(tag?.id)) {
                allTagsMap.set(tag?.id, tag);
            }
        });
    });
    const allTags = Array.from(allTagsMap.values());
    const filterContainer = document.createElement("div");
    filterContainer.style.cssText = "margin: 10px 0 20px 0; display: flex; flex-wrap: wrap; gap: 8px;";
    if (allTags.length > 0) {
        const btnAll = document.createElement("button");
        btnAll.innerText = "TODAS";
        btnAll.style.cssText = `padding: 4px 10px; font-size: 0.65rem; font-weight: bold; border-radius: 4px; cursor: pointer; border: 1px solid #ddd; background: ${activeTagFilter === null ? '#2c3e50' : '#fff'}; color: ${activeTagFilter === null ? '#fff' : '#2c3e50'};`;
        btnAll.onclick = () => { activeTagFilter = null; renderTasks(undefined, false); };
        filterContainer.appendChild(btnAll);
        allTags.forEach((tag) => {
            // Verificar se tag tem propriedades válidas
            if (!tag || !tag.name || !tag.id) {
                return; // Pular esta tag
            }
            const btnTag = document.createElement("button");
            btnTag.innerText = `#${tag.name.toUpperCase()}`;
            const isActive = activeTagFilter === tag.id;
            const tagColor = tag.color || '#3498db'; // Cor padrão se não houver cor
            btnTag.style.cssText = `padding: 4px 10px; font-size: 0.65rem; font-weight: bold; border-radius: 4px; cursor: pointer; border: 1px solid ${tagColor}; background: ${isActive ? tagColor : '#fff'}; color: ${isActive ? '#fff' : tagColor};`;
            btnTag.onclick = () => {
                activeTagFilter = tag.id;
                renderTasks(undefined, false);
            };
            filterContainer.appendChild(btnTag);
        });
        taskListUI.appendChild(filterContainer);
    }
    if (currentSearchTerm) {
        tasksToShow = tasksToShow.filter(t => t.title.toLowerCase().includes(currentSearchTerm));
    }
    // NOVO: Filtrar por tag usando ID
    if (activeTagFilter) {
        tasksToShow = tasksToShow.filter(t => {
            const taskTags = t.tags || [];
            return taskTags.some((tag) => tag.id === activeTagFilter);
        });
    }
    tasksToShow.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        const rawPriority = priorityService.getPriority(task.id);
        const pColor = priorityService.getPriorityColor(rawPriority);
        const pName = priorityService.getPriorityName(rawPriority);
        const pIcon = rawPriority === Priority.CRITICAL ? "🔥 " : "";
        // Obter tags do objeto tarefa
        const tags = task.tags || [];
        const attachments = attachmentService.getAttachments(task.id);
        const comments = commentService.getComments(task.id);
        li.style.cssText = `border-left: 5px solid ${pColor}; width: 100%; padding: 20px; margin-bottom: 20px; background-color: #fff; display: flex; flex-direction: column; box-sizing: border-box; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-radius: 4px;`;
        let badgesHtml = "";
        if (task instanceof Task) {
            badgesHtml = `
                <span style="background:#ecf0f1; color:#2c3e50; padding:2px 8px; border-radius:4px; font-size:0.65rem; font-weight:bold; border:1px solid #bdc3c7;">${task.category}</span>
                <span style="background:#f39c12; color:white; padding:2px 8px; border-radius:4px; font-size:0.65rem; font-weight:bold; margin-left:5px;">${task.subject}</span>`;
        }
        // Renderizar tags com cor dinâmica
        tags.forEach((t, index) => {
            if (!t || !t.name || !t.color) {
                return;
            }
            badgesHtml += `<span style="background:${t.color}; color:white; padding:2px 8px; border-radius:4px; font-size:0.65rem; font-weight:bold; margin-left:5px;">#${t.name}</span>`;
        });
        li.innerHTML = `
            <div style="width: 100%; flex: 1; ${task.completed ? 'opacity:0.7;' : ''}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="display:flex; gap:5px;">${badgesHtml}</div>
                    <div style="display:flex; gap:8px;">
                        ${canEditTask(userRole) ? `<button class="btnEditTask" style="background:none; border:1px solid #ddd; border-radius:3px; padding:3px 6px; cursor:pointer; color:#7f8c8d; font-size:0.8rem;">✎</button>` : ''}
                        ${canDeleteTask(userRole) ? `<button class="btnRemoveTaskAction" style="background:none; border:1px solid #fab1a0; border-radius:3px; padding:3px 6px; cursor:pointer; color:#e74c3c; font-size:0.8rem;">🗑</button>` : ''}
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 8px;">
                    <h2 style="margin:0; font-size:1.1rem; color:#2c3e50; overflow-wrap: anywhere; line-height: 1.2; flex: 1; font-weight: 600;">${task.title}</h2>
                    <button class="btnDone" style="background:${task.completed ? '#95a5a6' : '#2ecc71'}; color:white; border:none; padding:8px 18px; border-radius:5px; font-size:0.75rem; font-weight:bold; cursor:pointer; flex-shrink:0; text-transform: uppercase;">
                        ${task.completed ? 'REABRIR' : 'CONCLUIR'}
                    </button>
                </div>

                <div style="font-size:0.75rem; color:#7f8c8d; margin-bottom: 15px;">
                    <span style="color:${pColor}; font-weight:bold;">${pIcon}${pName}</span> | � ${listUsers.find(u => u.getId === task.userId)?.name || 'Sistema'} | 👥 ${assignmentService.getUsersFromTask(task.id).map(id => listUsers.find(u => u.getId === id)?.name).join(", ") || '(nenhum)'} | 📅 ${deadlineService.getDeadlineDate(task.id) || '29/01/2026'}
                </div>

                <div style="background:#fcfcfc; border:1px solid #f0f0f0; border-radius:6px; padding:12px; margin-bottom:18px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <div style="display:flex; align-items:center; gap:8px; background:#f1f8ff; padding:4px 10px; border-radius:4px; border:1px solid #e1f5fe;">
                             <span style="font-size:0.7rem; font-weight:bold; color:#2980b9;">📎 ANEXOS (${attachments.length})</span>
                             <button class="btnAddAttachment" style="background:#3498db; color:white; border:none; padding:3px 10px; border-radius:3px; font-size:0.65rem; font-weight:bold; cursor:pointer;">+ ANEXAR</button>
                        </div>
                        <div style="display:flex; gap:6px;">
                            <input type="text" class="inputNewTag" placeholder="Tag..." style="width:70px; font-size:0.7rem; padding:4px; border:1px solid #ddd; border-radius:3px;">
                            <button class="btnAddTag" style="background:#9b59b6; color:white; border:none; padding:4px 8px; border-radius:3px; cursor:pointer; font-weight:bold; font-size:0.7rem;">+</button>
                        </div>
                    </div>
                    <div style="display:flex; flex-wrap:wrap; gap:8px;">
                        ${attachments.map(a => `<div style="font-size:0.7rem; background:#fff; border:1px solid #eee; padding:4px 10px; border-radius:4px; display:flex; align-items:center; gap:6px;">${a.filename} <b class="btnDelAttachment" data-attach-id="${a.getId}" style="color:#e74c3c; cursor:pointer; font-size:0.9rem;">×</b></div>`).join('')}
                    </div>
                </div>

                <div style="border-top: 1px solid #f5f5f5; padding-top:15px;">
                    <div style="max-height:200px; overflow-y:auto; margin-bottom:12px;">
                        ${comments.map((c) => {
            const author = listUsers.find(u => u.getId === c.userId);
            return `
                                <div style="font-size:0.8rem; margin-bottom:12px; border-bottom:1px solid #fafafa; padding-bottom:8px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <strong style="color:#34495e;">${author?.name || 'Sistema'}</strong>
                                        <div style="display:flex; align-items:center; gap:10px;">
                                            <span style="font-size:0.65rem; color:#bdc3c7;">${new Date(c.createdAt || Date.now()).toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                                            ${c.userId === selectedUserId ? `<b class="btnDelComment" data-comm-id="${c.id}" style="color:#e74c3c; cursor:pointer; font-size:0.9rem;">×</b>` : ''}
                                        </div>
                                    </div>
                                    <div style="color:#555; line-height:1.4; overflow-wrap: anywhere; margin-top:3px;">${c.message}</div>
                                </div>`;
        }).join('')}
                    </div>
                    <div style="display:flex; gap:10px;">
                        <input type="text" class="inputComment" placeholder="Escrever nota..." style="flex:1; padding:8px 12px; border:1px solid #ddd; border-radius:5px; font-size:0.8rem;">
                        <button class="btnAddComment" style="background:#2c3e50; color:white; border:none; padding:0 20px; border-radius:5px; font-weight:bold; cursor:pointer; font-size:0.75rem;">Postar</button>
                    </div>
                </div>
            </div>`;
        // EVENTOS DO BOTÃO CONCLUIR COM REGRAS AUTOMÁTICAS
        li.querySelector(".btnDone")?.addEventListener("click", () => {
            task.moveTo(task.completed ? TaskStatus.CREATED : TaskStatus.COMPLETED);
            automationRulesService.applyRules(task);
            renderTasks(undefined, false);
            renderUsers();
        });
        li.querySelector(".btnAddTag")?.addEventListener("click", async () => {
            const val = li.querySelector(".inputNewTag").value;
            if (val.trim()) {
                try {
                    // Primeiro, obter todas as tags
                    const allTags = await tagService.getAllTags();
                    // Procurar se existe tag com esse nome
                    let tag = allTags.find((t) => t.name.toLowerCase() === val.trim().toLowerCase());
                    // Se não encontrou, criar nova tag
                    if (!tag) {
                        tag = await tagService.createTag(val.trim(), '#9b59b6');
                    }
                    // Verificar se tag foi criada/encontrada com sucesso
                    if (tag && tag.id) {
                        // Adicionar tag à tarefa
                        await tagService.addTag(task.id, tag.id);
                        // Limpar input
                        li.querySelector(".inputNewTag").value = "";
                        // ✅ IMPORTANTE: Recarregar TODAS as tags (via GET /tasks/:id/tags)
                        // Isso sincroniza a nova tag com o objeto task em memory
                        await reloadAllTagsForUser(selectedUserId || 0);
                        // Atualizar UI
                        renderTasks(undefined, false);
                    }
                    else {
                        throw new Error("Falha ao criar ou encontrar tag: " + val.trim());
                    }
                }
                catch (error) {
                    console.error('[renderTask] Erro ao adicionar tag:', error);
                    alert(`Erro ao adicionar tag: ${error}`);
                }
            }
        });
        li.querySelector(".btnAddComment")?.addEventListener("click", () => {
            const val = li.querySelector(".inputComment").value;
            if (val.trim()) {
                commentService.addComment(task.id, selectedUserId, val.trim());
                renderTasks(undefined, false);
            }
        });
        li.querySelectorAll(".btnDelComment").forEach(b => b.addEventListener("click", (e) => {
            const id = e.currentTarget.dataset.commId;
            if (confirm("Apagar nota?")) {
                commentService.removeComment(Number(id));
                renderTasks(undefined, false);
            }
        }));
        li.querySelector(".btnAddAttachment")?.addEventListener("click", () => {
            const n = prompt("Nome do anexo:");
            if (n) {
                attachmentService.addAttachment(task.id, n, "1MB", "#");
                renderTasks(undefined, false);
            }
        });
        li.querySelectorAll(".btnDelAttachment").forEach(b => b.addEventListener("click", (e) => {
            attachmentService.removeAttachment(Number(e.currentTarget.dataset.attachId));
            renderTasks(undefined, false);
        }));
        li.querySelector(".btnEditTask")?.addEventListener("click", () => window.abrirModalEdicao?.(task));
        li.querySelector(".btnRemoveTaskAction")?.addEventListener("click", async () => {
            if (confirm("Remover tarefa?")) {
                try {
                    await deleteTaskLogic(task.id);
                    renderTasks();
                    renderUsers();
                }
                catch (error) {
                    console.error('Erro ao deletar tarefa:', error);
                    alert('❌ Erro ao deletar tarefa. Tente novamente.');
                }
            }
        });
        taskListUI.appendChild(li);
    });
}
