const BASE_URL = 'http://localhost:3000';

/**
 * Função para obter todos os usuários
 * @param search - Buscar usuários por nome (opcional)
 * @param sort - Ordenar por 'asc' ou 'desc' (opcional)
 */
async function getAllUsers(search: string = '', sort: string = '') {
    try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (sort) params.append('sort', sort);

        const query = params.toString() ? `?${params.toString()}` : '';
        const res = await fetch(`${BASE_URL}/users${query}`);
        
        if (!res.ok) throw new Error("Erro: " + res.status);
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Função para obter um usuário específico por ID
 * @param id - ID do usuário
 */
async function getUserById(id: number) {
    try {
        const res = await fetch(`${BASE_URL}/users/${id}`);
        
        if (!res.ok) throw new Error("Erro: " + res.status);
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Função para criar um novo usuário
 * @param user - Objeto com dados do usuário (name, email)
 */
async function createUser(user: any) {
    try {
        const res = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        
        if (!res.ok) throw new Error("Erro: " + res.status);
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Função para atualizar um usuário existente
 * @param id - ID do usuário
 * @param user - Objeto com dados a atualizar (name, email)
 */
async function updateUser(id: number, user: any) {
    try {
        const res = await fetch(`${BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        
        if (!res.ok) throw new Error("Erro: " + res.status);
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Função para deletar um usuário
 * @param id - ID do usuário a deletar
 */
async function deleteUser(id: number) {
    try {
        const res = await fetch(`${BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!res.ok) throw new Error("Erro: " + res.status);
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Função para obter todas as tarefas de um usuário específico
 * @param userId - ID do usuário
 */
async function getUserTasks(userId: number) {
    try {
        const res = await fetch(`${BASE_URL}/users/${userId}/tasks`);
        
        if (!res.ok) throw new Error("Erro: " + res.status);
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Função para alternar o status do usuário entre ativo e inativo
 * @param id - ID do usuário
 */
async function toggleUserStatus(id: number) {
    try {
        // Fazer PATCH para alternar status - deixar o backend fazer a lógica
        const res = await fetch(`${BASE_URL}/users/${id}/toggle`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!res.ok) throw new Error("Erro: " + res.status);
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Função para obter estatísticas dos usuários
 */
async function getUserStats() {
    try {
        const res = await fetch(`${BASE_URL}/users/stats`);
        
        if (!res.ok) throw new Error("Erro: " + res.status);
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const apiUserService = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserTasks,
    toggleUserStatus,
    getUserStats
}

