import { UserClass } from '../models/UserClass.js';
import { UserRole } from '../security/UserRole.js';
import { apiUserService } from '../api/apiUserService.js';

export let listUsers: UserClass[] = [];
export let selectedUserId: number | null = null;

export const setSelectedUserId = (id: number | null) => { selectedUserId = id; };

/**
 * Carrega dados iniciais de usuários do backend via API
 * Converte os dados do backend para instâncias de UserClass
 */
export async function loadInitialData(renderCallback: () => void): Promise<void> {
    try {
        listUsers.splice(0, listUsers.length);
        
        // Buscar usuários do backend
        const users = await apiUserService.getAllUsers();
        
        // Converter dados do backend para instâncias de UserClass
        if (Array.isArray(users)) {
            users.forEach((userData: any) => {
                // Mapear 'ativo' do backend para campo de status
                const newUser = new UserClass(
                    userData.id, 
                    userData.name, 
                    userData.email, 
                    userData.role || UserRole.USER
                );
                
                // Se o usuário estiver inativo no backend, ativar a flag de inativo
                if (!userData.ativo) {
                    newUser.toggleActive();
                }
                
                listUsers.push(newUser);
            });
        }
        
        console.log(`[UserService] ${listUsers.length} usuários carregados do backend`);
        renderCallback();
    } catch (error) {
        console.error('[UserService] Erro ao carregar usuários do backend:', error);
        renderCallback(); // Renderizar mesmo com erro
    }
}

/**
 * Alterna o status do usuário (ativo/inativo) via backend
 * @param id - ID do usuário
 */
export async function toggleUserStatus(id: number): Promise<void> {
    try {
        const user = listUsers.find(u => u.getId === id);
        if (!user) {
            throw new Error(`[UserService] Usuário com ID ${id} não encontrado`);
        }
        
        // Chamar backend para alternar status
        const updatedUserData = await apiUserService.toggleUserStatus(id);
        
        if (!updatedUserData) {
            throw new Error(`[UserService] Backend não retornou dados ao alternar status`);
        }
        
        // Sincronizar com o status retornado pelo backend
        const novoStatus = updatedUserData.ativo !== undefined ? updatedUserData.ativo : updatedUserData.active;
        user.setActive(novoStatus);
        
        console.log(`[UserService] Status do usuário ${id} alterado para: ${novoStatus}`);
    } catch (error) {
        console.error('[UserService] Erro ao alternar status do usuário:', error);
        throw error; // Re-throw para tratamento na UI
    }
}

/**
 * Remove um usuário via backend
 * @param id - ID do usuário a remover
 */
export async function removeUserLogic(id: number): Promise<void> {
    try {
        // Chamar backend para deletar usuário
        await apiUserService.deleteUser(id);
        
        // Remover do array local
        const index = listUsers.findIndex(u => u.getId === id);
        if (index !== -1) {
            listUsers.splice(index, 1);
            console.log(`[UserService] Usuário ${id} deletado com sucesso`);
        }
    } catch (error) {
        console.error('[UserService] Erro ao deletar usuário:', error);
    }
}

/**
 * Cria um novo usuário via backend
 * @param userData - Dados do novo usuário { name, email, role? }
 */
export async function createUserBackend(userData: { name: string; email: string; role: UserRole }): Promise<UserClass | null> {
    try {
        const newUserData = await apiUserService.createUser(userData);
        
        const newUser = new UserClass(
            newUserData.id,
            newUserData.name,
            newUserData.email,
            newUserData.role || UserRole.USER
        );
        
        listUsers.push(newUser);
        console.log(`[UserService] Novo usuário criado com sucesso: ${newUserData.id}`);
        return newUser;
    } catch (error) {
        console.error('[UserService] Erro ao criar usuário:', error);
        return null;
    }
}

/**
 * Atualiza dados de um usuário via backend
 * @param id - ID do usuário
 * @param updateData - Dados a atualizar { name?, email? }
 */
export async function updateUserBackend(id: number, updateData: Partial<{ name: string; email: string }>): Promise<UserClass | null> {
    try {
        const updatedUserData = await apiUserService.updateUser(id, updateData);
        
        const user = listUsers.find(u => u.getId === id);
        if (user && updatedUserData) {
            // Atualizar dados locais (se necessário, conforme sua implementação de UserClass)
            console.log(`[UserService] Usuário ${id} atualizado com sucesso`);
            return user;
        }
        return null;
    } catch (error) {
        console.error('[UserService] Erro ao atualizar usuário:', error);
        return null;
    }
}

/**
 * Obtém tarefas de um usuário específico do backend
 * @param userId - ID do usuário
 */
export async function getUserTasksBackend(userId: number): Promise<any[]> {
    try {
        const tasks = await apiUserService.getUserTasks(userId);
        console.log(`[UserService] Tarefas do usuário ${userId} obtidas`);
        return Array.isArray(tasks) ? tasks : [];
    } catch (error) {
        console.error('[UserService] Erro ao obter tarefas do usuário:', error);
        return [];
    }
}

/**
 * Obtém estatísticas de usuários do backend
 */
export async function getUserStatsBackend(): Promise<any> {
    try {
        const stats = await apiUserService.getUserStats();
        console.log('[UserService] Estatísticas de usuários obtidas');
        return stats;
    } catch (error) {
        console.error('[UserService] Erro ao obter estatísticas:', error);
        return null;
    }
}







