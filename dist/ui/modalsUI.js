import { listTasks } from '../state/state.js';
export function abrirModalDetalhes(user) {
    const modal = document.getElementById("userDetails");
    const content = document.getElementById("detailsContent");
    const tarefas = listTasks.filter(t => t.userId === user.id);
    const concluidas = tarefas.filter(t => t.completed).length;
    content.innerHTML = `
        <div class="modal-info">
            <p><strong>Nome:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Status:</strong> ${user.active ? 'Ativo' : 'Inativo'}</p>
            <hr>
            <ul>
                <li>Total de Tarefas: ${tarefas.length}</li>
                <li>Concluídas: ${concluidas}</li>
                <li>Pendentes: ${tarefas.length - concluidas}</li>
            </ul>
        </div>
    `;
    modal.style.display = "block";
}
