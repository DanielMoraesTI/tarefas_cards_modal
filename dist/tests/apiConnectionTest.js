/**
 * TEST - Teste de Conexão com Backend
 *
 * Este arquivo testa a conexão entre o frontend e o backend
 * Expõe funções de teste no console do navegador
 *
 * Uso no console do navegador:
 * - testBackendConnection() - Teste básico
 * - testGetAllUsers() - Buscar todos os usuários
 * - testCreateUser() - Criar um novo usuário
 */
import { apiUserService } from '../api/apiUserService.js';
/**
 * Teste básico de conexão com o backend
 */
export async function testBackendConnection() {
    console.log('%c[TESTE] Iniciando teste de conexão...', 'color: #3498db; font-weight: bold;');
    try {
        const response = await fetch('http://localhost:3000/');
        console.log('%c✓ Backend respondeu com status:', 'color: #27ae60; font-weight: bold;', response.status);
        return true;
    }
    catch (error) {
        console.error('%c✗ Erro na conexão:', 'color: #e74c3c; font-weight: bold;', error);
        return false;
    }
}
/**
 * Teste de busca de todos os usuários
 */
export async function testGetAllUsers() {
    console.log('%c[TESTE] Buscando todos os usuários...', 'color: #3498db; font-weight: bold;');
    try {
        const users = await apiUserService.getAllUsers();
        console.log('%c✓ Usuários obtidos:', 'color: #27ae60; font-weight: bold;', users);
        console.log(`%cTotal: ${users.length} usuários`, 'color: #f39c12; font-weight: bold;');
        return users;
    }
    catch (error) {
        console.error('%c✗ Erro ao buscar usuários:', 'color: #e74c3c; font-weight: bold;', error);
        return null;
    }
}
/**
 * Teste de busca de usuário por ID
 */
export async function testGetUserById(id) {
    console.log(`%c[TESTE] Buscando usuário ID: ${id}`, 'color: #3498db; font-weight: bold;');
    try {
        const user = await apiUserService.getUserById(id);
        console.log('%c✓ Usuário obtido:', 'color: #27ae60; font-weight: bold;', user);
        return user;
    }
    catch (error) {
        console.error('%c✗ Erro ao buscar usuário:', 'color: #e74c3c; font-weight: bold;', error);
        return null;
    }
}
/**
 * Teste de criação de usuário
 */
export async function testCreateUser(name, email) {
    console.log(`%c[TESTE] Criando usuário: ${name} (${email})`, 'color: #3498db; font-weight: bold;');
    try {
        const newUser = await apiUserService.createUser({ name, email });
        console.log('%c✓ Usuário criado:', 'color: #27ae60; font-weight: bold;', newUser);
        return newUser;
    }
    catch (error) {
        console.error('%c✗ Erro ao criar usuário:', 'color: #e74c3c; font-weight: bold;', error);
        return null;
    }
}
/**
 * Teste de atualização de usuário
 */
export async function testUpdateUser(id, name, email) {
    console.log(`%c[TESTE] Atualizando usuário ID: ${id}`, 'color: #3498db; font-weight: bold;');
    try {
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        const updatedUser = await apiUserService.updateUser(id, updateData);
        console.log('%c✓ Usuário atualizado:', 'color: #27ae60; font-weight: bold;', updatedUser);
        return updatedUser;
    }
    catch (error) {
        console.error('%c✗ Erro ao atualizar usuário:', 'color: #e74c3c; font-weight: bold;', error);
        return null;
    }
}
/**
 * Teste de deleção de usuário
 */
export async function testDeleteUser(id) {
    console.log(`%c[TESTE] Deletando usuário ID: ${id}`, 'color: #3498db; font-weight: bold;');
    try {
        const deletedUser = await apiUserService.deleteUser(id);
        console.log('%c✓ Usuário deletado:', 'color: #27ae60; font-weight: bold;', deletedUser);
        return deletedUser;
    }
    catch (error) {
        console.error('%c✗ Erro ao deletar usuário:', 'color: #e74c3c; font-weight: bold;', error);
        return null;
    }
}
/**
 * Teste de alternância de status do usuário
 */
export async function testToggleUserStatus(id) {
    console.log(`%c[TESTE] Alternando status do usuário ID: ${id}`, 'color: #3498db; font-weight: bold;');
    try {
        const updatedUser = await apiUserService.toggleUserStatus(id);
        console.log('%c✓ Status alternado:', 'color: #27ae60; font-weight: bold;', updatedUser);
        return updatedUser;
    }
    catch (error) {
        console.error('%c✗ Erro ao alternar status:', 'color: #e74c3c; font-weight: bold;', error);
        return null;
    }
}
/**
 * Teste de obtenção de tarefas do usuário
 */
export async function testGetUserTasks(userId) {
    console.log(`%c[TESTE] Buscando tarefas do usuário ID: ${userId}`, 'color: #3498db; font-weight: bold;');
    try {
        const tasks = await apiUserService.getUserTasks(userId);
        console.log('%c✓ Tarefas obtidas:', 'color: #27ae60; font-weight: bold;', tasks);
        console.log(`%cTotal: ${tasks.length} tarefas`, 'color: #f39c12; font-weight: bold;');
        return tasks;
    }
    catch (error) {
        console.error('%c✗ Erro ao buscar tarefas:', 'color: #e74c3c; font-weight: bold;', error);
        return null;
    }
}
/**
 * Teste de obtenção de estatísticas
 */
export async function testGetUserStats() {
    console.log('%c[TESTE] Buscando estatísticas de usuários...', 'color: #3498db; font-weight: bold;');
    try {
        const stats = await apiUserService.getUserStats();
        console.log('%c✓ Estatísticas obtidas:', 'color: #27ae60; font-weight: bold;', stats);
        return stats;
    }
    catch (error) {
        console.error('%c✗ Erro ao buscar estatísticas:', 'color: #e74c3c; font-weight: bold;', error);
        return null;
    }
}
/**
 * Teste completo - executa todos os testes em sequência
 */
export async function testAll() {
    console.clear();
    console.log('%c====== TESTE COMPLETO DE CONEXÃO ======', 'color: #2980b9; font-weight: bold; font-size: 14px;');
    // 1. Teste de conexão básica
    const connectionOk = await testBackendConnection();
    if (!connectionOk) {
        console.log('%c✗ Conexão com backend falhou. Verifique se o servidor está rodando em http://localhost:3000', 'color: #e74c3c; font-weight: bold;');
        return;
    }
    console.log('%c--- Aguardando 1 segundo...', 'color: #95a5a6;');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 2. Teste de busca de usuários
    console.log('\n');
    const users = await testGetAllUsers();
    if (users && users.length > 0) {
        console.log('%c--- Aguardando 1 segundo...', 'color: #95a5a6;');
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 3. Teste de busca por ID
        console.log('\n');
        await testGetUserById(users[0].id);
        console.log('%c--- Aguardando 1 segundo...', 'color: #95a5a6;');
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 4. Teste de estatísticas
        console.log('\n');
        await testGetUserStats();
    }
    console.log('\n%c====== TESTE CONCLUÍDO ======', 'color: #2980b9; font-weight: bold; font-size: 14px;');
}
// Expor funções no console global
window.testBackendConnection = testBackendConnection;
window.testGetAllUsers = testGetAllUsers;
window.testGetUserById = testGetUserById;
window.testCreateUser = testCreateUser;
window.testUpdateUser = testUpdateUser;
window.testDeleteUser = testDeleteUser;
window.testToggleUserStatus = testToggleUserStatus;
window.testGetUserTasks = testGetUserTasks;
window.testGetUserStats = testGetUserStats;
window.testAll = testAll;
console.log('%c[API Tests] Funções disponíveis no console:', 'color: #3498db; font-weight: bold;');
console.log('- testBackendConnection()');
console.log('- testGetAllUsers()');
console.log('- testGetUserById(id)');
console.log('- testCreateUser(name, email)');
console.log('- testUpdateUser(id, name?, email?)');
console.log('- testDeleteUser(id)');
console.log('- testToggleUserStatus(id)');
console.log('- testGetUserTasks(userId)');
console.log('- testGetUserStats()');
console.log('- testAll() - Executa todos os testes');
