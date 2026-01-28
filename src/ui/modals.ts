import { UserClass } from '../models/index.js';
import { listTasks } from '../services/index.js';
import { assignmentService } from '../services/AssignmentService.js';

export let userSendoVisualizado: UserClass | null = null;

export const atualizarConteudoModal = (user: UserClass) => {
    const detailsContent = document.getElementById("detailsContent") as HTMLElement;
    if (!detailsContent) return;

    const dataCriacao = user.getCreatedAt.toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const tarefasDoUsuario = listTasks.filter(t => {
        const isOwner = t.userId === user.getId;
        const isAssigned = assignmentService.getUsersFromTask(t.id).includes(user.getId);
        return isOwner || isAssigned;
    });

    const concluidas = tarefasDoUsuario.filter(t => t.completed).length;

    detailsContent.innerHTML = `
        <div class="modal-info" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 5px solid #2c3e50;">
                <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Nome:</strong> <span style="color: #34495e;">${user.name}</span></p>
                <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Email:</strong> <span style="color: #34495e;">${user.getEmail()}</span></p>
                <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Função:</strong> <span style="color: #e74c3c; font-weight: bold;">${user.getRole()}</span></p>
                <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Status:</strong> <span style="color: ${user.isActive() ? '#27ae60' : '#e74c3c'}; font-weight: bold;">${user.isActive() ? 'Ativo' : 'Inativo'}</span></p>
                <p style="margin: 8px 0; font-size: 0.9rem;"><strong style="color: #7f8c8d;">Criado em:</strong> <span style="color: #95a5a6;">${dataCriacao}</span></p>
            </div>
            <hr style="border: none; border-top: 2px solid #ecf0f1; margin: 15px 0;">
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 5px solid #3498db;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #2c3e50;">📊 Resumo de Atividade:</p>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="padding: 6px 0; border-bottom: 1px solid #ecf0f1;">
                        <span style="color: #7f8c8d;">Total de Tarefas (Dono + Colaborador):</span> 
                        <strong style="color: #2c3e50; float: right;">${tarefasDoUsuario.length}</strong>
                    </li>
                    <li style="padding: 6px 0; border-bottom: 1px solid #ecf0f1;">
                        <span style="color: #7f8c8d;">Concluídas:</span> 
                        <strong style="color: #27ae60; float: right;">${concluidas}</strong>
                    </li>
                    <li style="padding: 6px 0;">
                        <span style="color: #7f8c8d;">Pendentes:</span> 
                        <strong style="color: #e74c3c; float: right;">${tarefasDoUsuario.length - concluidas}</strong>
                    </li>
                </ul>
            </div>
        </div>
    `;
};

export function showModal(message: string): void {
    const errorModal = document.getElementById("errorModal") as HTMLDialogElement;
    const msgContainer = document.getElementById("modalMessage");
    if (errorModal && msgContainer) {
        msgContainer.innerText = message;
        errorModal.showModal();
    }
}

export function setUserSendoVisualizado(user: UserClass | null) {
    userSendoVisualizado = user;
}