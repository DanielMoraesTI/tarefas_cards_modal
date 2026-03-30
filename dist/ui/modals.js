import { listTasks, toggleUserStatus } from '../services/index.js';
import { assignmentService } from '../services/AssignmentService.js';
import { automationRulesService } from '../services/AutomationRulesService.js';
import { renderUsers, renderTasks } from './index.js';
export let userSendoVisualizado = null;
let handleToggleStatus = null;
export const atualizarConteudoModal = (user) => {
    const detailsContent = document.getElementById("detailsContent");
    if (!detailsContent)
        return;
    const dataCriacao = user.getCreatedAt.toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const tarefasDoUsuario = listTasks.filter(t => {
        const isOwner = t.userId === user.getId;
        const isAssigned = assignmentService.getUsersFromTask(t.id).includes(user.getId);
        return isOwner || isAssigned;
    });
    const concluidas = tarefasDoUsuario.filter(t => t.completed).length;
    // Teste nova atualização do GitHub para identificar a não atualização do Modal de Detalhes na pages
    detailsContent.innerHTML = `
        <div class="modal-info" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 5px solid #2c3e50;">
                <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Nome:</strong> <span style="color: #34495e;">${user.name}</span></p>
                <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Email:</strong> <span style="color: #34495e;">${user.getEmail()}</span></p>
                <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Função:</strong> <span style="color: #e74c3c; font-weight: bold;">${user.getRole()}</span></p>
                <p style="margin: 8px 0;"><strong style="color: #2c3e50;">Status:</strong> <span style="color: ${user.isActive() ? '#27ae60' : '#e74c3c'}; font-weight: bold;">${user.isActive() ? 'Ativo' : 'Inativo'}</span></p>
                <p style="margin: 8px 0; font-size: 0.9rem;"><strong style="color: #7f8c8d;">Criado em:</strong> <span style="color: #95a5a6;">${dataCriacao}</span></p>
                
                <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                    <button id="btnChangeUserStatus" data-id="${user.getId}" style="cursor: pointer; background: ${user.isActive() ? '#e74c3c' : '#27ae60'}; color: white; border: none; padding: 8px 15px; border-radius: 5px; font-weight: bold; font-size: 0.8rem; width: 100%;">
                        ${user.isActive() ? 'INATIVAR UTILIZADOR' : 'ATIVAR UTILIZADOR'}
                    </button>
                    ${user.isActive() ? '<p style="font-size: 0.65rem; color: #7f8c8d; margin-top: 5px; text-align: center;">*Inativar removerá todas as atribuições automaticamente.</p>' : ''}
                </div>
            </div>

            <hr style="border: none; border-top: 2px solid #ecf0f1; margin: 15px 0;">
            
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 5px solid #3498db;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #2c3e50;">📊 Resumo de Atividade:</p>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="padding: 6px 0; border-bottom: 1px solid #ecf0f1;">
                        <span style="color: #7f8c8d;">Total de Tarefas:</span> 
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
    // Remover listener antigo se existir
    const btnToggle = document.getElementById("btnChangeUserStatus");
    if (btnToggle && handleToggleStatus) {
        btnToggle.removeEventListener("click", handleToggleStatus);
    }
    // Criar novo handler nomeado
    handleToggleStatus = async () => {
        try {
            // Chamar o backend para alternar o status
            await toggleUserStatus(user.getId);
            // Aplicar regras de automação se inativar
            if (!user.isActive()) {
                automationRulesService.applyUserRules(user);
            }
            // Atualizar o conteúdo do modal
            atualizarConteudoModal(user);
            // Atualizar a UI
            renderUsers();
            renderTasks();
        }
        catch (error) {
            console.error('Erro ao alternar status do usuário:', error);
            alert('Erro ao alternar status do usuário. Tente novamente.');
        }
    };
    // Adicionar novo listener
    document.getElementById("btnChangeUserStatus")?.addEventListener("click", handleToggleStatus);
};
export function showModal(message) {
    const errorModal = document.getElementById("errorModal");
    const msgContainer = document.getElementById("modalMessage");
    if (errorModal && msgContainer) {
        msgContainer.innerText = message;
        errorModal.showModal();
    }
}
export function setUserSendoVisualizado(user) {
    userSendoVisualizado = user;
}
