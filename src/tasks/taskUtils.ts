import { ITask } from './ITask.js';

export function processTask(task: ITask) {
    const type = task.getType().toLowerCase();

    console.log(`%c[Processador] Iniciando tratamento de: ${task.title} (Tipo: ${type})`, "color: blue; font-weight: bold;");

    switch (type) {
        case 'bug':
            console.warn(`🚨 PRIORIDADE CRÍTICA: Bug detectado.`);
            console.log(`[Log Automático]: Verificando dependências de sistema para o ID: ${task.id}`);
            enviarNotificacaoDesenvolvedor(`Falha técnica reportada: ${task.title}`);
            break;

        case 'feature':
            console.log(`💡 PLANEAMENTO: Nova funcionalidade em análise.`);
            console.log(`[Sugestão]: Validar requisitos de experiência de utilizador (UX).`);
            break;

        case 'task':
        default:
            console.log(`📋 TAREFA JURÍDICA: Seguindo fluxo padrão de advocacia.`);
            console.log(`[Ação]: Aguardando movimentação processual.`);
            break;
    }
}

function enviarNotificacaoDesenvolvedor(mensagem: string) {
    console.log(`%c[Notificação Push Sent]: ${mensagem}`, "color: red; italic: true;");
}