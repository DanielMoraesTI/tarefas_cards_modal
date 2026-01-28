import { Task } from '../models/task.js';
import { listTasks, setListTasks, selectedUserId, listUsers, assignmentService, deadlineService, priorityService, CommentService, AttachmentService, TagService } from '../services/index.js';
import { renderUsers } from './renderUser.js';
import { TaskStatus } from '../tasks/TaskStatus.js';
import { canDeleteTask, canEditTask } from '../security/permissions.js';
import { Priority } from '../tasks/Priority.js';
const taskListUI = document.getElementById("taskList");
const searchInput = document.getElementById("searchTask");
const commentService = new CommentService();
const attachmentService = new AttachmentService();
const tagService = new TagService();
let activeTagFilter = null;
let currentSearchTerm = "";
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        renderTasks(undefined, false);
    });
}
/**
 * @param arrayToRender
 * @param resetFilters
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
    if (selectedUserId === null)
        return;
    const currentUser = listUsers.find(u => u.getId === selectedUserId);
    const userRole = currentUser ? currentUser.getRole() : null;
    let tasksToShow = arrayToRender || listTasks.filter(t => t.userId === selectedUserId || assignmentService.getUsersFromTask(t.id).includes(selectedUserId));
    const allTags = new Set();
    tasksToShow.forEach(t => tagService.getTags(t.id).forEach(tag => allTags.add(tag)));
    const filterContainer = document.createElement("div");
    filterContainer.style.cssText = "margin: 10px 0 20px 0; display: flex; flex-wrap: wrap; gap: 8px;";
    if (allTags.size > 0) {
        const btnAll = document.createElement("button");
        btnAll.innerText = "TODAS";
        btnAll.style.cssText = `padding: 4px 10px; font-size: 0.65rem; font-weight: bold; border-radius: 4px; cursor: pointer; border: 1px solid #ddd; background: ${activeTagFilter === null ? '#2c3e50' : '#fff'}; color: ${activeTagFilter === null ? '#fff' : '#2c3e50'};`;
        btnAll.onclick = () => { activeTagFilter = null; renderTasks(undefined, false); };
        filterContainer.appendChild(btnAll);
        allTags.forEach(tag => {
            const btnTag = document.createElement("button");
            btnTag.innerText = `#${tag.toUpperCase()}`;
            const isActive = activeTagFilter === tag;
            btnTag.style.cssText = `padding: 4px 10px; font-size: 0.65rem; font-weight: bold; border-radius: 4px; cursor: pointer; border: 1px solid #9b59b6; background: ${isActive ? '#9b59b6' : '#fff'}; color: ${isActive ? '#fff' : '#9b59b6'};`;
            btnTag.onclick = () => {
                activeTagFilter = tag;
                renderTasks(undefined, false);
            };
            filterContainer.appendChild(btnTag);
        });
        taskListUI.appendChild(filterContainer);
    }
    if (currentSearchTerm) {
        tasksToShow = tasksToShow.filter(t => t.title.toLowerCase().includes(currentSearchTerm));
    }
    if (activeTagFilter) {
        tasksToShow = tasksToShow.filter(t => tagService.getTags(t.id).includes(activeTagFilter));
    }
    tasksToShow.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        const rawPriority = priorityService.getPriority(task.id);
        const pColor = priorityService.getPriorityColor(rawPriority);
        const pName = priorityService.getPriorityName(rawPriority);
        const pIcon = rawPriority === Priority.CRITICAL ? "🔥 " : "";
        const tags = tagService.getTags(task.id);
        const attachments = attachmentService.getAttachments(task.id);
        const comments = commentService.getComments(task.id);
        li.style.cssText = `border-left: 5px solid ${pColor}; width: 100%; min-height: 400px; padding: 20px; margin-bottom: 20px; background-color: #fff; display: flex; flex-direction: column; box-sizing: border-box; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-radius: 4px;`;
        let badgesHtml = "";
        if (task instanceof Task) {
            badgesHtml = `
                <span style="background:#ecf0f1; color:#2c3e50; padding:2px 8px; border-radius:4px; font-size:0.65rem; font-weight:bold; border:1px solid #bdc3c7;">${task.category}</span>
                <span style="background:#f39c12; color:white; padding:2px 8px; border-radius:4px; font-size:0.65rem; font-weight:bold; margin-left:5px;">${task.subject}</span>`;
        }
        tags.forEach(t => {
            badgesHtml += `<span style="background:#9b59b6; color:white; padding:2px 8px; border-radius:4px; font-size:0.65rem; font-weight:bold; margin-left:5px;">#${t}</span>`;
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
                    <span style="color:${pColor}; font-weight:bold;">${pIcon}${pName}</span> | 👥 ${assignmentService.getUsersFromTask(task.id).map(id => listUsers.find(u => u.getId === id)?.name).join(", ")} | 📅 ${deadlineService.getDeadlineDate(task.id) || '29/01/2026'}
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
        li.querySelector(".btnDone")?.addEventListener("click", () => {
            task.moveTo(task.completed ? TaskStatus.CREATED : TaskStatus.COMPLETED);
            renderTasks(undefined, false);
            renderUsers();
        });
        li.querySelector(".btnAddTag")?.addEventListener("click", () => {
            const val = li.querySelector(".inputNewTag").value;
            if (val.trim()) {
                tagService.addTag(task.id, val.trim());
                renderTasks(undefined, false);
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
        li.querySelector(".btnRemoveTaskAction")?.addEventListener("click", () => {
            if (confirm("Remover tarefa?")) {
                setListTasks(listTasks.filter(t => t.id !== task.id));
                renderTasks();
                renderUsers();
            }
        });
        taskListUI.appendChild(li);
    });
}
