import { listUsers } from './userService.js';
import { UserRole } from '../security/UserRole.js';

export class NotificationService {

    notifyUser(userId: number, message: string) {
        const user = listUsers.find(u => u.getId === userId);
        if (user) {
            console.log(`%c[NOTIFICAÇÃO PARA ${user.name}]: ${message}`, "color: #3498db; font-weight: bold;");
        }
    }

    notifyGroup(userIds: number[], message: string) {
        console.group("📢 Notificação de Grupo");
        userIds.forEach(id => this.notifyUser(id, message));
        console.groupEnd();
    }

    notifyAdmins(message: string) {
        const admins = listUsers.filter(u => u.getRole() === UserRole.ADMIN);
        
        if (admins.length > 0) {
            console.log(`%c[ALERTA ADMINS]: ${message}`, "color: #e67e22; border: 1px solid #e67e22; padding: 2px;");
            admins.forEach(admin => {
                console.log(`   -> Enviado para: ${admin.name} (${admin.getEmail()})`);
            });
        }
    }
}

export const notificationService = new NotificationService();