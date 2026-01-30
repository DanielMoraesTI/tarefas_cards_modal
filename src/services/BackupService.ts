import { listUsers, listTasks } from './index.js';
import { assignmentService } from './AssignmentService.js';
import { SystemConfig } from './SystemConfig.js'; 
import { SystemLogger } from '../logs/SystemLogger.js'; // Importação do novo Logger

/**
 * Exporta dados em formato de objetos para armazenamento ou transmissão.
 * Integrado com SystemConfig (Metadados) e SystemLogger (Histórico).
 */
export class BackupService {

    static exportUsers(): any[] {
        return listUsers.map(user => ({
            id: user.getId,
            name: user.name,
            email: user.getEmail(),
            role: user.getRole(),
            isActive: user.isActive(),
        }));
    }

    static exportTasks(): any[] {
        return listTasks.map(task => ({
            id: task.id,
            userId: task.userId,
            title: task.title,
            completed: task.completed,
            category: (task as any).category || null,
            subject: (task as any).subject || null,
            tag: (task as any).tag || null,
        }));
    }

    static exportAssignments(): any[] {
        const assignments: any[] = [];
        
        listTasks.forEach(task => {
            const assignedUsers = assignmentService.getUsersFromTask(task.id);
            assignedUsers.forEach(userId => {
                assignments.push({
                    taskId: task.id,
                    userId: userId,
                });
            });
        });

        return assignments;
    }

    /**
     * Consolida todos os dados do sistema.
     * Agora regista a operação no SystemLogger e anexa os logs ao backup.
     */
    static exportAll(): any {
        const systemInfo = SystemConfig.getInfo();

        // Registo da ação no Logger Global
        SystemLogger.log(`[Backup] Iniciando exportação total. Versão: ${systemInfo.version}`);

        const backupData = {
            // Metadados do Sistema
            appName: systemInfo.appName,
            version: systemInfo.version,
            environment: systemInfo.environment,
            
            // Dados da Aplicação
            timestamp: new Date().toISOString(),
            users: this.exportUsers(),
            tasks: this.exportTasks(),
            assignments: this.exportAssignments(),
            
            // Histórico de logs (Anexado para auditoria completa)
            systemLogs: SystemLogger.getLogs()
        };

        SystemLogger.log(`[Backup] Exportação concluída. Total de tarefas: ${backupData.tasks.length}`);

        return backupData;
    }
}

export default BackupService;
