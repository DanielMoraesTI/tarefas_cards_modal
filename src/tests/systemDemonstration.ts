/**
 * SYSTEM DEMONSTRATION - Testes dos Serviços Estáticos
 * 
 * Este módulo concentra todas as fases de demonstração:
 * - FASE 1: Inicialização do sistema
 * - FASE 2: Geração de IDs
 * - FASE 3: Validações de dados
 * - FASE 4: Regras de negócio
 * - FASE 5: Fluxo completo
 * - FASE 6: Relatório de logs
 * - FASE 7: Estatísticas finais
 * - FASE 8: Teste EntityList
 * - FASE 9: Teste SimpleCache
 * - FASE 10: Teste Favorites
 * - FASE 11: Teste Paginator
 * - FASE 12: Teste TagManager
 * - FASE 13: Teste WatcherSystem
 * - FASE 14: Teste PriorityManager
 * - FASE 15: Teste RatingSystem
 * - FASE 16: Teste DependencyGraph
 */

import { SystemConfig } from '../services/SystemConfig.js';
import { IdGenerator } from '../utils/IdGenerator.js';
import { SystemLogger } from '../logs/SystemLogger.js';
import { GlobalValidators } from '../utils/GlobalValidators.js';
import { BusinessRules } from '../services/BusinessRules.js';
import { UserClass } from '../models/UserClass.js';
import { Task } from '../models/task.js';
import { EntityList } from '../utils/EntityList.js';
import { SimpleCache } from '../utils/SimpleCache.js';
import { Favorites } from '../utils/Favorites.js';
import { Paginator } from '../utils/Paginator.js';
import { UserRole } from '../security/UserRole.js';
import { TagManager } from '../utils/TagManager.js';
import { WatcherSystem } from '../utils/WatcherSystem.js';
import { PriorityManager } from '../utils/PriorityManager.js';
import { RatingSystem } from '../utils/RatingSystem.js';
import { DependencyGraph } from '../utils/DependencyGraph.js';

/**
 * FASE 1: INICIALIZAÇÃO DO SISTEMA
 */
function phase1InitializeSystem(): void {
    console.log("=== FASE 1: INICIALIZAÇÃO DO SISTEMA ===\n");
    
    SystemConfig.setEnvironment('development');
    SystemLogger.log("[Sistema] Ambiente configurado para: development");
    
    const systemInfo = SystemConfig.getInfo();
    SystemLogger.log(`[Sistema] Aplicação: ${systemInfo.appName} v${systemInfo.version}`);
    SystemLogger.log(`[Sistema] Ambiente: ${systemInfo.environment}`);
    
    console.log("📊 Configuração do Sistema:");
    console.log(`   Nome: ${systemInfo.appName}`);
    console.log(`   Versão: ${systemInfo.version}`);
    console.log(`   Ambiente: ${systemInfo.environment}`);
    console.log("");
}

/**
 * FASE 2: GERAÇÃO E VALIDAÇÃO DE IDs
 */
function phase2DemonstrateIdGeneration(): void {
    console.log("=== FASE 2: GERAÇÃO DE IDs ===\n");
    
    const ids: number[] = [];
    const numIds = 5;
    
    for (let i = 0; i < numIds; i++) {
        const newId = IdGenerator.generate();
        ids.push(newId);
        SystemLogger.log(`[IdGenerator] ID gerado: ${newId}`);
    }
    
    console.log("🆔 IDs Gerados:");
    ids.forEach((id, index) => {
        console.log(`   #${index + 1}: ${id}`);
        
        if (GlobalValidators.isPositiveNumber(id)) {
            console.log(`      ✅ Validação: ID é número positivo`);
        }
    });
    console.log("");
}

/**
 * FASE 3: VALIDAÇÃO DE DADOS
 */
function phase3DemonstrateValidations(): void {
    console.log("=== FASE 3: VALIDAÇÃO DE DADOS ===\n");
    
    const testCases = {
        emails: ["abel@example.com", "invalid-email", "danilson@example.com", ""],
        names: ["Abel", "A", "Danilson", "   "],
        priorities: [5, 0, -3, 10]
    };
    
    // Validar emails
    console.log("📧 Validação de Emails:");
    testCases.emails.forEach(email => {
        const isValid = GlobalValidators.isValidEmail(email);
        const status = isValid ? "✅ VÁLIDO" : "❌ INVÁLIDO";
        console.log(`   ${status}: "${email}"`);
        
        if (!isValid) {
            SystemLogger.log(`[Validação] Email inválido rejeitado: ${email}`);
        }
    });
    console.log("");
    
    // Validar nomes
    console.log("👤 Validação de Nomes (mín. 3 caracteres):");
    testCases.names.forEach(name => {
        const isValid = GlobalValidators.minLength(name, 3);
        const status = isValid ? "✅ VÁLIDO" : "❌ INVÁLIDO";
        console.log(`   ${status}: "${name}"`);
        
        if (!isValid) {
            SystemLogger.log(`[Validação] Nome inválido rejeitado: "${name}"`);
        }
    });
    console.log("");
    
    // Validar números positivos
    console.log("🔢 Validação de Números Positivos:");
    testCases.priorities.forEach(num => {
        const isValid = GlobalValidators.isPositiveNumber(num);
        const status = isValid ? "✅ VÁLIDO" : "❌ INVÁLIDO";
        console.log(`   ${status}: ${num}`);
        
        if (!isValid) {
            SystemLogger.log(`[Validação] Número inválido rejeitado: ${num}`);
        }
    });
    console.log("");
    
    // Validar texto não vazio
    console.log("📝 Validação de Texto Não Vazio:");
    const texts = ["Tarefa importante", "   ", "", "Audiência"];
    texts.forEach(text => {
        const isValid = GlobalValidators.isNonEmpty(text);
        const status = isValid ? "✅ VÁLIDO" : "❌ INVÁLIDO";
        console.log(`   ${status}: "${text}"`);
    });
    console.log("");
}

/**
 * FASE 4: APLICAÇÃO DE REGRAS DE NEGÓCIO
 */
function phase4DemonstrateBusinessRules(): void {
    console.log("=== FASE 4: REGRAS DE NEGÓCIO ===\n");
    
    // Cenário 1: Conclusão de tarefas
    console.log("📋 Cenário 1: Conclusão de Tarefas");
    
    const taskScenarios = [
        { name: "Tarefa Normal", isBlocked: false },
        { name: "Tarefa Bloqueada", isBlocked: true }
    ];
    
    taskScenarios.forEach(scenario => {
        const canComplete = BusinessRules.canTaskBeCompleted(scenario.isBlocked);
        const status = canComplete ? "✅ PODE" : "❌ NÃO PODE";
        console.log(`   ${status} concluir: ${scenario.name}`);
        
        if (!canComplete) {
            SystemLogger.log(`[Regra Negócio] Bloqueio: Tarefa bloqueada não pode ser concluída`);
        }
    });
    console.log("");
    
    // Cenário 2: Desativação de usuários
    console.log("👥 Cenário 2: Desativação de Usuários");
    
    const userScenarios = [
        { name: "João Silva", activeTasks: 0 },
        { name: "Maria Santos", activeTasks: 3 },
        { name: "Ana Costa", activeTasks: 1 }
    ];
    
    userScenarios.forEach(scenario => {
        const canDeactivate = BusinessRules.canUserBeDeactivated(scenario.activeTasks);
        const status = canDeactivate ? "✅ PODE" : "❌ NÃO PODE";
        console.log(`   ${status} desativar: ${scenario.name} (${scenario.activeTasks} tarefas ativas)`);
        
        if (!canDeactivate) {
            SystemLogger.log(`[Regra Negócio] Bloqueio: Usuário ${scenario.name} tem ${scenario.activeTasks} tarefas ativas`);
        }
    });
    console.log("");
    
    // Cenário 3: Atribuição de tarefas
    console.log("📌 Cenário 3: Atribuição de Tarefas");
    
    const assignScenarios = [
        { name: "Usuário Ativo", isActive: true },
        { name: "Usuário Inativo", isActive: false }
    ];
    
    assignScenarios.forEach(scenario => {
        const canAssign = BusinessRules.canAssignTask(scenario.isActive);
        const status = canAssign ? "✅ PODE" : "❌ NÃO PODE";
        console.log(`   ${status} atribuir tarefa: ${scenario.name}`);
        
        if (!canAssign) {
            SystemLogger.log(`[Regra Negócio] Bloqueio: Não pode atribuir tarefa a usuário inativo`);
        }
    });
    console.log("");
    
    // Cenário 4: Validar títulos
    console.log("✍️ Cenário 4: Validação de Títulos");
    
    const titles = [
        "Preparar audiência com cliente",
        "AB",
        "Redigir contrato de compra e venda",
        ""
    ];
    
    titles.forEach(title => {
        const isValid = BusinessRules.isValidTitle(title);
        const status = isValid ? "✅ VÁLIDO" : "❌ INVÁLIDO";
        console.log(`   ${status}: "${title}"`);
        
        if (!isValid) {
            SystemLogger.log(`[Regra Negócio] Título inválido: "${title}" (mín. 3 caracteres)`);
        }
    });
    console.log("");
}

/**
 * FASE 5: FLUXO COMPLETO
 */
function phase5DemonstrateCompleteFlow(): void {
    console.log("=== FASE 5: FLUXO COMPLETO (Simulação Real) ===\n");
    
    const newUserData = {
        name: "Danilo",
        email: "danilo@example.com",
        role: "MEMBER"
    };
    
    console.log("👤 Criando Novo Usuário:");
    console.log(`   Nome: ${newUserData.name}`);
    console.log(`   Email: ${newUserData.email}`);
    console.log(`   Função: ${newUserData.role}`);
    console.log("");
    
    // Passo 1: Validar nome
    console.log("📝 Passo 1: Validar Nome");
    if (!GlobalValidators.minLength(newUserData.name, 3)) {
        console.log("   ❌ ERRO: Nome muito curto!");
        SystemLogger.log(`[Erro] Nome inválido: ${newUserData.name}`);
        return;
    }
    console.log("   ✅ Nome válido");
    
    // Passo 2: Validar email
    console.log("📧 Passo 2: Validar Email");
    if (!GlobalValidators.isValidEmail(newUserData.email)) {
        console.log("   ❌ ERRO: Email inválido!");
        SystemLogger.log(`[Erro] Email inválido: ${newUserData.email}`);
        return;
    }
    console.log("   ✅ Email válido");
    
    // Passo 3: Gerar ID
    console.log("🆔 Passo 3: Gerar ID");
    const userId = IdGenerator.generate();
    console.log(`   ✅ ID gerado: ${userId}`);
    SystemLogger.log(`[Sistema] Novo usuário criado: ${newUserData.name} (ID: ${userId})`);
    console.log("");
    
    const newTaskData = {
        title: "Preparar defesa para processo trabalhista",
        userId: userId,
        isBlocked: false
    };
    
    console.log("📋 Criando Nova Tarefa:");
    console.log(`   Título: ${newTaskData.title}`);
    console.log(`   Usuário: ${newUserData.name}`);
    console.log("");
    
    // Passo 4: Validar título
    console.log("📝 Passo 4: Validar Título");
    if (!BusinessRules.isValidTitle(newTaskData.title)) {
        console.log("   ❌ ERRO: Título inválido!");
        SystemLogger.log(`[Erro] Título inválido: ${newTaskData.title}`);
        return;
    }
    console.log("   ✅ Título válido");
    
    // Passo 5: Verificar atribuição
    console.log("📌 Passo 5: Verificar Atribuição");
    const userActive = true;
    if (!BusinessRules.canAssignTask(userActive)) {
        console.log("   ❌ ERRO: Não pode atribuir a usuário inativo!");
        SystemLogger.log(`[Erro] Tentativa de atribuir tarefa a usuário inativo`);
        return;
    }
    console.log("   ✅ Pode atribuir tarefa");
    
    // Passo 6: Gerar ID da tarefa
    console.log("🆔 Passo 6: Gerar ID da Tarefa");
    const taskId = IdGenerator.generate();
    console.log(`   ✅ ID gerado: ${taskId}`);
    SystemLogger.log(`[Sistema] Nova tarefa criada: "${newTaskData.title}" (ID: ${taskId})`);
    
    console.log("");
    console.log("✅ Fluxo Completo Executado com Sucesso!");
    console.log("");
}

/**
 * FASE 6: EXIBIR RELATÓRIO DE LOGS
 */
function phase6DisplayLogsReport(): void {
    console.log("=== FASE 6: RELATÓRIO DE LOGS ===\n");
    
    const logs = SystemLogger.getLogs();
    
    console.log(`📊 Total de Logs Registrados: ${logs.length}`);
    console.log("");
    
    if (logs.length > 0) {
        console.log("📋 Histórico Completo:");
        logs.forEach((log, index) => {
            console.log(`   ${index + 1}. ${log}`);
        });
    } else {
        console.log("   (Nenhum log registrado)");
    }
    
    console.log("");
}

/**
 * FASE 7: ESTATÍSTICAS FINAIS
 */
function phase7DisplayFinalStatistics(): void {
    console.log("=== FASE 7: ESTATÍSTICAS FINAIS ===\n");
    
    const systemInfo = SystemConfig.getInfo();
    const totalLogs = SystemLogger.getLogs().length;
    
    console.log("📊 Resumo da Execução:");
    console.log(`   Aplicação: ${systemInfo.appName}`);
    console.log(`   Versão: ${systemInfo.version}`);
    console.log(`   Ambiente: ${systemInfo.environment}`);
    console.log(`   Total de Logs: ${totalLogs}`);
    console.log("");
    
    console.log("✅ Serviços Estáticos Utilizados:");
    console.log("   ✓ SystemConfig - Configuração do sistema");
    console.log("   ✓ IdGenerator - Geração de IDs únicos");
    console.log("   ✓ SystemLogger - Registro de eventos");
    console.log("   ✓ GlobalValidators - Validações globais");
    console.log("   ✓ BusinessRules - Regras de negócio");
    console.log("");
}

/**
 * FASE 8: TESTE ENTITYLIST
 */
function phase8TestEntityList(): void {
    console.log("=== FASE 8: TESTE ENTITYLIST ===\n");
    
    const userList = new EntityList<UserClass>();
    
    const user1 = new UserClass(101, "Abel", "abel@example.com", UserRole.MEMBER);
    const user2 = new UserClass(102, "Danilson", "danilson@example.com", UserRole.ADMIN);
    
    userList.add(user1);
    userList.add(user2);
    
    console.log("👥 Usuários:", userList.getAll());
    console.log(`   Total: ${userList.count()}`);
    
    const taskList = new EntityList<Task>();
    const task1 = new Task("Preparar audiência", 101, "Audiência", "Civil");
    
    taskList.add(task1);
    
    console.log("📋 Tarefas:", taskList.getAll());
    
    SystemLogger.log("[EntityList] Testes concluídos");
    console.log("");
}

/**
 * FASE 9: TESTE SIMPLECACHE
 */
function phase9TestSimpleCache(): void {
    console.log("=== FASE 9: TESTE SIMPLECACHE ===\n");
    
    // Teste 1: Cache de Usuários
    console.log("👥 Teste 1: Cache de Usuários (por ID)");
    
    const userCache = new SimpleCache<number, UserClass>();
    
    const user1 = new UserClass(1, "Abel", "abel@example.com", UserRole.MEMBER);
    const user2 = new UserClass(2, "Danilson", "danilson@example.com", UserRole.ADMIN);
    const user3 = new UserClass(3, "Gabriel", "gabriel@example.com", UserRole.MANAGER);
    
    userCache.set(1, user1);
    userCache.set(2, user2);
    userCache.set(3, user3);
    
    console.log(`   Usuários no cache: ${userCache.size()}`);
    console.log(`   Cache vazio? ${userCache.isEmpty()}`);
    
    const foundUser = userCache.get(1);
    console.log(`   Buscar ID 1: ${foundUser ? foundUser.name : "Não encontrado"}`);
    
    console.log(`   Existe ID 2? ${userCache.has(2) ? "✅ Sim" : "❌ Não"}`);
    console.log(`   Existe ID 999? ${userCache.has(999) ? "✅ Sim" : "❌ Não"}`);
    console.log("");
    
    // Teste 2: Cache de Tarefas
    console.log("📋 Teste 2: Cache de Tarefas (por ID)");
    
    const taskCache = new SimpleCache<number, Task>();
    
    const task1 = new Task("Preparar audiência", 1, "Audiência", "Civil");
    const task2 = new Task("Redigir contrato", 2, "Atendimento", "Civil");
    const task3 = new Task("Analisar processo", 3, "Análise", "Penal");
    
    taskCache.set(10, task1);
    taskCache.set(20, task2);
    taskCache.set(30, task3);
    
    console.log(`   Tarefas no cache: ${taskCache.size()}`);
    
    const foundTask = taskCache.get(10);
    console.log(`   Buscar ID 10: ${foundTask ? foundTask.title : "Não encontrado"}`);
    console.log("");
    
    // Teste 3: Operações avançadas
    console.log("🔍 Teste 3: Operações Avançadas");
    
    const users = userCache.getMany([1, 2, 999]);
    console.log(`   Buscar IDs [1, 2, 999]:`);
    users.forEach((user, index) => {
        const ids = [1, 2, 999];
        console.log(`      ID ${ids[index]}: ${user ? user.name : "Não encontrado"}`);
    });
    
    const defaultUser = new UserClass(0, "Sara", "sara@example.com", UserRole.VIEWER);
    const userOrDefault = userCache.getOrDefault(999, defaultUser);
    console.log(`   Buscar ID 999 com padrão: ${userOrDefault.name}`);
    console.log("");
    
    // Teste 4: Listar dados
    console.log("📊 Teste 4: Listar Dados do Cache");
    
    const userIds = userCache.keys();
    console.log(`   IDs de usuários: [${userIds.join(", ")}]`);
    
    const allUsers = userCache.values();
    console.log("   Todos os usuários:");
    allUsers.forEach(user => {
        console.log(`      - ${user.name} (${user.getEmail()})`);
    });
    console.log("");
    
    // Teste 5: Remover items
    console.log("🗑️ Teste 5: Remoção");
    
    const sizeBefore = userCache.size();
    const removed = userCache.delete(3);
    const sizeAfter = userCache.size();
    
    console.log(`   Remover ID 3: ${removed ? "✅ Removido" : "❌ Não existia"}`);
    console.log(`   Tamanho antes: ${sizeBefore}, depois: ${sizeAfter}`);
    console.log("");
    
    // Teste 6: Limpar cache
    console.log("🧹 Teste 6: Limpar Cache");
    
    const testCache = new SimpleCache<number, UserClass>();
    testCache.set(1, user1);
    testCache.set(2, user2);
    
    console.log(`   Tamanho antes de limpar: ${testCache.size()}`);
    testCache.clear();
    console.log(`   Tamanho após limpar: ${testCache.size()}`);
    console.log(`   Cache vazio? ${testCache.isEmpty() ? "✅ Sim" : "❌ Não"}`);
    console.log("");
    
    SystemLogger.log("[SimpleCache] Todos os testes executados com sucesso");
}

/**
 * FASE 10: TESTE FAVORITES
 * Demonstrar sistema genérico de favoritos para usuários, tarefas e outras entidades
 */
function phase10TestFavorites(): void {
    console.log("=== FASE 10: TESTE FAVORITES ===\n");
    
    // Teste 1: Favoritos de Usuários
    console.log("👥 Teste 1: Favoritos de Usuários");
    
    const favUsers = new Favorites<UserClass>();
    
    const user1 = new UserClass(201, "Rebeca", "rebeca@example.com", UserRole.MEMBER);
    const user2 = new UserClass(202, "Gabriela", "gabriela@example.com", UserRole.ADMIN);
    const user3 = new UserClass(203, "Tiago", "tiago@example.com", UserRole.MANAGER);
    
    favUsers.add(user1);
    favUsers.add(user2);
    favUsers.add(user3);
    
    console.log(`   Usuários adicionados: ${favUsers.count()}`);
    console.log(`   Contém user1? ${favUsers.exists(user1) ? "✅ Sim" : "❌ Não"}`);
    console.log(`   Contém user2? ${favUsers.exists(user2) ? "✅ Sim" : "❌ Não"}`);
    console.log(`   Vazio? ${favUsers.isEmpty() ? "Sim" : "❌ Não"}`);
    
    console.log("   Favoritos:");
    favUsers.getAll().forEach(user => {
        console.log(`      - ${user.name} (ID: ${user.getId})`);
    });
    console.log("");
    
    // Teste 2: Remover de Favoritos
    console.log("🗑️ Teste 2: Remover de Favoritos");
    
    const removed = favUsers.remove(user1);
    console.log(`   Remover user1: ${removed ? "✅ Removido com sucesso" : "❌ Não existia"}`);
    console.log(`   Total após remover: ${favUsers.count()}`);
    
    console.log("   Favoritos restantes:");
    favUsers.getAll().forEach(user => {
        console.log(`      - ${user.name} (ID: ${user.getId})`);
    });
    console.log("");
    
    // Teste 3: Evitar Duplicados
    console.log("🔄 Teste 3: Evitar Duplicados");
    
    const beforeDuplicate = favUsers.count();
    favUsers.add(user2); // Tentar adicionar user2 novamente
    const afterDuplicate = favUsers.count();
    
    console.log(`   Total antes: ${beforeDuplicate}`);
    console.log(`   Tentativa de adicionar duplicate user2`);
    console.log(`   Total depois: ${afterDuplicate}`);
    console.log(`   Duplicado evitado? ${beforeDuplicate === afterDuplicate ? "✅ Sim" : "❌ Não"}`);
    console.log("");
    
    // Teste 4: Favoritos de Tarefas
    console.log("📋 Teste 4: Favoritos de Tarefas");
    
    const favTasks = new Favorites<Task>();
    
    const task1 = new Task("Preparar audiência", 201, "Audiência", "Civil");
    const task2 = new Task("Redigir contrato", 202, "Atendimento", "Civil");
    const task3 = new Task("Analisar processo", 203, "Análise", "Penal");
    
    favTasks.add(task1);
    favTasks.add(task2);
    favTasks.add(task3);
    
    console.log(`   Tarefas adicionadas: ${favTasks.count()}`);
    console.log(`   Contém task1? ${favTasks.exists(task1) ? "✅ Sim" : "❌ Não"}`);
    console.log(`   Contém task3? ${favTasks.exists(task3) ? "✅ Sim" : "❌ Não"}`);
    
    console.log("   Tarefas favoritas:");
    favTasks.getAll().forEach(task => {
        console.log(`      - "${task.title}" (Categoria: ${task.category})`);
    });
    console.log("");
    
    // Teste 5: RemoveAll
    console.log("🔪 Teste 5: RemoveAll (Remover Múltiplas)");
    
    const itemsToRemove = [task1, task2];
    favTasks.removeAll(itemsToRemove);
    
    console.log(`   Remover ${itemsToRemove.length} tarefas`);
    console.log(`   Total restante: ${favTasks.count()}`);
    console.log("   Tarefas após remover:");
    favTasks.getAll().forEach(task => {
        console.log(`      - "${task.title}"`);
    });
    console.log("");
    
    // Teste 6: Clear (Limpar Tudo)
    console.log("🧹 Teste 6: Clear (Limpar Todos os Favoritos)");
    
    console.log(`   Total antes de limpar: ${favUsers.count()}`);
    favUsers.clear();
    console.log(`   Total após limpar: ${favUsers.count()}`);
    console.log(`   Vazio agora? ${favUsers.isEmpty() ? "✅ Sim" : "❌ Não"}`);
    console.log("");
    
    // Teste 7: Favoritos Mistos (Exemplo com diferentes tipos)
    console.log("🎯 Teste 7: Tipagem Genérica - Múltiplos Tipos");
    
    const favUsersList = new Favorites<UserClass>();
    const favTasksList = new Favorites<Task>();
    const favNumbers = new Favorites<number>();
    
    favUsersList.add(user1);
    favUsersList.add(user2);
    
    favTasksList.add(task1);
    
    favNumbers.add(1);
    favNumbers.add(2);
    favNumbers.add(3);
    
    console.log(`   Usuários favoritos: ${favUsersList.count()}`);
    console.log(`   Tarefas favoritas: ${favTasksList.count()}`);
    console.log(`   Números favoritos: ${favNumbers.count()}`);
    console.log(`   Números: [${favNumbers.getAll().join(", ")}]`);
    console.log("");
    
    SystemLogger.log("[Favorites] Todos os testes executados com sucesso");
}

/**
 * FASE 11: TESTE PAGINATOR
 * Demonstrar paginação genérica de listas
 */
function phase11TestPaginator(): void {
    console.log("=== FASE 11: TESTE PAGINATOR ===\n");
    
    const paginator = new Paginator<UserClass>();
    
    // Criar lista de usuários para paginar
    const users: UserClass[] = [
        new UserClass(1, "Abel", "abel@example.com", UserRole.MEMBER),
        new UserClass(2, "Danilson", "danilson@example.com", UserRole.ADMIN),
        new UserClass(3, "Rebeca", "rebeca@example.com", UserRole.MANAGER),
        new UserClass(4, "Gabriela", "gabriela@example.com", UserRole.MEMBER),
        new UserClass(5, "Gabriel", "gabriel@example.com", UserRole.MEMBER),
        new UserClass(6, "Tiago", "tiago@example.com", UserRole.ADMIN),
    ];
    
    // Teste 1: Paginação Básica
    console.log("📄 Teste 1: Paginação Básica (2 items por página)");
    
    const page1 = paginator.paginate(users, 1, 2);
    const page2 = paginator.paginate(users, 2, 2);
    const page3 = paginator.paginate(users, 3, 2);
    
    console.log(`   Página 1 (${page1.length} items):`);
    page1.forEach(user => {
        console.log(`      - ${user.name} (ID: ${user.getId})`);
    });
    
    console.log(`   Página 2 (${page2.length} items):`);
    page2.forEach(user => {
        console.log(`      - ${user.name} (ID: ${user.getId})`);
    });
    
    console.log(`   Página 3 (${page3.length} items):`);
    page3.forEach(user => {
        console.log(`      - ${user.name} (ID: ${user.getId})`);
    });
    console.log("");
    
    // Teste 2: Informações de Paginação
    console.log("📊 Teste 2: Informações de Paginação");
    
    const totalPages = paginator.getTotalPages(users.length, 2);
    console.log(`   Total de usuários: ${users.length}`);
    console.log(`   Items por página: 2`);
    console.log(`   Total de páginas: ${totalPages}`);
    
    const isValidPage1 = paginator.isValidPage(1, users.length, 2);
    const isValidPage5 = paginator.isValidPage(5, users.length, 2);
    const isValidPage10 = paginator.isValidPage(10, users.length, 2);
    
    console.log(`   Página 1 válida? ${isValidPage1 ? "✅ Sim" : "❌ Não"}`);
    console.log(`   Página 5 válida? ${isValidPage5 ? "✅ Sim" : "❌ Não"}`);
    console.log(`   Página 10 válida? ${isValidPage10 ? "✅ Sim" : "❌ Não"}`);
    console.log("");
    
    // Teste 3: PageInfo Detalhado
    console.log("ℹ️ Teste 3: Informações Detalhadas da Página");
    
    const pageInfo = paginator.getPageInfo(users, 2, 2);
    
    console.log(`   Página atual: ${pageInfo.currentPage}`);
    console.log(`   Tamanho página: ${pageInfo.pageSize}`);
    console.log(`   Total items: ${pageInfo.totalItems}`);
    console.log(`   Total páginas: ${pageInfo.totalPages}`);
    console.log(`   Índice início: ${pageInfo.startIndex}`);
    console.log(`   Índice fim: ${pageInfo.endIndex}`);
    console.log(`   Próxima página? ${pageInfo.hasNextPage ? "✅ Sim" : "❌ Não"}`);
    console.log(`   Página anterior? ${pageInfo.hasPreviousPage ? "✅ Sim" : "❌ Não"}`);
    
    console.log("   Items da página:");
    pageInfo.items.forEach(user => {
        console.log(`      - ${user.name}`);
    });
    console.log("");
    
    // Teste 4: PaginateWithInfo
    console.log("📋 Teste 4: Paginate com Info Compacto");
    
    const result = paginator.paginateWithInfo(users, 2, 2);
    
    console.log(`   Page: ${result.page}/${result.pages}`);
    console.log(`   Items nesta página: ${result.items.length}`);
    console.log(`   Total items: ${result.total}`);
    console.log(`   Tem próxima? ${result.hasNext ? "✅ Sim" : "❌ Não"}`);
    console.log(`   Tem anterior? ${result.hasPrev ? "✅ Sim" : "❌ Não"}`);
    console.log("");
    
    // Teste 5: GetAllPages
    console.log("🔄 Teste 5: Obter Todas as Páginas");
    
    const allPages = paginator.getAllPages(users, 2);
    
    console.log(`   Total de páginas: ${allPages.length}`);
    allPages.forEach((page, index) => {
        const names = page.map(u => u.name).join(", ");
        console.log(`      Página ${index + 1}: [${names}]`);
    });
    console.log("");
    
    // Teste 6: FindItemPage
    console.log("🔍 Teste 6: Encontrar Item e Sua Página");
    
    const itemInfo = paginator.findItemPage(
        users,
        user => user.name === "Carlos Mendes",
        2
    );
    
    if (itemInfo) {
        console.log(`   Item encontrado: ${itemInfo.item.name}`);
        console.log(`   Está na página: ${itemInfo.page}`);
        console.log(`   Posição na página: ${itemInfo.indexInPage + 1}`);
        console.log(`   Índice no array: ${itemInfo.indexInArray}`);
    } else {
        console.log("   Item não encontrado");
    }
    console.log("");
    
    // Teste 7: Paginação de Tarefas
    console.log("📌 Teste 7: Paginação de Tarefas (3 items por página)");
    
    const paginator2 = new Paginator<Task>();
    
    const tasks: Task[] = [
        new Task("Audiência 1", 1, "Audiência", "Civil"),
        new Task("Contrato 1", 1, "Atendimento", "Civil"),
        new Task("Análise 1", 1, "Análise", "Penal"),
        new Task("Audiência 2", 2, "Audiência", "Civil"),
        new Task("Contrato 2", 2, "Atendimento", "Civil"),
    ];
    
    const tasksPage1 = paginator2.paginate(tasks, 1, 3);
    const tasksPage2 = paginator2.paginate(tasks, 2, 3);
    
    console.log(`   Página 1 de tarefas (${tasksPage1.length} items):`);
    tasksPage1.forEach(task => {
        console.log(`      - "${task.title}" (${task.category})`);
    });
    
    console.log(`   Página 2 de tarefas (${tasksPage2.length} items):`);
    tasksPage2.forEach(task => {
        console.log(`      - "${task.title}" (${task.category})`);
    });
    console.log("");
    
    SystemLogger.log("[Paginator] Todos os testes executados com sucesso");
}

/**
 * FASE 12: TESTE DO TAGMANAGER
 * Sistema genérico de etiquetas (Tags)
 */
function phase12TestTagManager(): void {
    console.log("=== FASE 12: SISTEMA DE ETIQUETAS (TAGMANAGER) ===\n");
    
    const tagManager = new TagManager<any>();
    
    // Criar objetos de teste (tarefas e utilizadores)
    const task1 = { id: 1, title: 'Implementar login' };
    const task2 = { id: 2, title: 'Corrigir bug de layout' };
    const user1 = { id: 101, name: 'João' };
    const user2 = { id: 102, name: 'Maria' };
    
    console.log("🏷️  Adicionando tags a tarefas e utilizadores:");
    
    // Adicionar tags a tarefas
    tagManager.addTag(task1, 'urgente');
    tagManager.addTag(task1, 'backend');
    tagManager.addTag(task1, 'segurança');
    console.log(`   Task "${task1.title}" - tags: [${tagManager.getTags(task1).join(', ')}]`);
    
    tagManager.addTag(task2, 'bug');
    tagManager.addTag(task2, 'frontend');
    tagManager.addTag(task2, 'urgente');
    console.log(`   Task "${task2.title}" - tags: [${tagManager.getTags(task2).join(', ')}]`);
    
    // Adicionar tags a utilizadores
    tagManager.addTag(user1, 'admin');
    tagManager.addTag(user1, 'remoto');
    console.log(`   User "${user1.name}" - tags: [${tagManager.getTags(user1).join(', ')}]`);
    
    tagManager.addTag(user2, 'junior');
    tagManager.addTag(user2, 'frontend');
    console.log(`   User "${user2.name}" - tags: [${tagManager.getTags(user2).join(', ')}]`);
    
    console.log("");
    console.log("🔍 Verificações:");
    
    const hasUrgente = tagManager.hasTag(task1, 'urgente');
    const noFrontend = tagManager.hasTag(task1, 'frontend');
    console.log(`   Task "${task1.title}" tem tag "urgente"? ${hasUrgente ? '✅ Sim' : '❌ Não'}`);
    console.log(`   Task "${task1.title}" tem tag "frontend"? ${noFrontend ? '✅ Sim' : '❌ Não'}`);
    
    console.log("");
    console.log("🎯 Itens com tags específicas:");
    
    const urgentItems = tagManager.getItemsWithTag('urgente');
    console.log(`   Items com tag "urgente": ${urgentItems.length}`);
    urgentItems.forEach(item => {
        const label = item.title ? `Task: ${item.title}` : `User: ${item.name}`;
        console.log(`      - ${label}`);
    });
    
    const frontendItems = tagManager.getItemsWithTag('frontend');
    console.log(`   Items com tag "frontend": ${frontendItems.length}`);
    frontendItems.forEach(item => {
        const label = item.title ? `Task: ${item.title}` : `User: ${item.name}`;
        console.log(`      - ${label}`);
    });
    
    console.log("");
    console.log("✂️  Removendo tags:");
    
    tagManager.removeTag(task1, 'backend');
    console.log(`   Removida tag "backend" de Task "${task1.title}"`);
    console.log(`   Tags restantes: [${tagManager.getTags(task1).join(', ')}]`);
    
    console.log("");
    
    SystemLogger.log("[TagManager] Todos os testes executados com sucesso");
}

/**
 * FASE 13: TESTE DO WATCHERSYSTEM
 * Sistema genérico de subscrições/watchers
 */
function phase13TestWatcherSystem(): void {
    console.log("=== FASE 13: SISTEMA DE SUBSCRIÇÕES (WATCHERSYSTEM) ===\n");
    
    const watcherSystem = new WatcherSystem<any, any>();
    
    // Criar objetos de teste
    const task1 = { id: 1, title: 'Implementar autenticação' };
    const task2 = { id: 2, title: 'Corrigir validações' };
    const user1 = { id: 101, name: 'João Silva' };
    const user2 = { id: 102, name: 'Maria Santos' };
    const user3 = { id: 103, name: 'Pedro Costa' };
    
    console.log("👁️  Utilizadores a seguir (watch) tarefas:");
    
    // Utilizadores a seguir tarefas
    watcherSystem.watch(task1, user1);
    watcherSystem.watch(task1, user2);
    watcherSystem.watch(task1, user3);
    console.log(`   Task "${task1.title}" - ${watcherSystem.getWatcherCount(task1)} seguidores`);
    console.log(`      Seguidores: ${watcherSystem.getWatchers(task1).map((u: any) => u.name).join(', ')}`);
    
    watcherSystem.watch(task2, user1);
    watcherSystem.watch(task2, user2);
    console.log(`   Task "${task2.title}" - ${watcherSystem.getWatcherCount(task2)} seguidores`);
    console.log(`      Seguidores: ${watcherSystem.getWatchers(task2).map((u: any) => u.name).join(', ')}`);
    
    console.log("");
    console.log("🔍 Verificações:");
    
    const isWatching = watcherSystem.isWatching(task1, user1);
    const notWatching = watcherSystem.isWatching(task2, user3);
    console.log(`   ${user1.name} está a seguir Task "${task1.title}"? ${isWatching ? '✅ Sim' : '❌ Não'}`);
    console.log(`   ${user3.name} está a seguir Task "${task2.title}"? ${notWatching ? '✅ Sim' : '❌ Não'}`);
    
    console.log("");
    console.log("📋 Tarefas seguidas por cada utilizador:");
    
    const user1Tasks = watcherSystem.getWatchedTargets(user1);
    console.log(`   ${user1.name} está a seguir ${user1Tasks.length} tarefa(s):`);
    user1Tasks.forEach(task => {
        console.log(`      - ${task.title}`);
    });
    
    const user3Tasks = watcherSystem.getWatchedTargets(user3);
    console.log(`   ${user3.name} está a seguir ${user3Tasks.length} tarefa(s):`);
    user3Tasks.forEach(task => {
        console.log(`      - ${task.title}`);
    });
    
    console.log("");
    console.log("✋ Deixar de seguir:");
    
    watcherSystem.unwatch(task1, user3);
    console.log(`   ${user3.name} deixou de seguir "${task1.title}"`);
    console.log(`   Task "${task1.title}" agora tem ${watcherSystem.getWatcherCount(task1)} seguidores`);
    
    console.log("");
    console.log("🔔 Notificação de seguidores:");
    
    console.log(`   Notificando seguidores de "${task1.title}":`);
    watcherSystem.notifyWatchers(task1, (watcher: any) => {
        console.log(`      📧 Notificação enviada para ${watcher.name}`);
    });
    
    console.log("");
    
    SystemLogger.log("[WatcherSystem] Todos os testes executados com sucesso");
}

/**
 * FASE 14: TESTE DO PRIORITYMANAGER
 * Sistema genérico de prioridades
 */
function phase14TestPriorityManager(): void {
    console.log("=== FASE 14: SISTEMA DE PRIORIDADES (PRIORITYMANAGER) ===\n");
    
    const priorityManager = new PriorityManager<any>();
    
    // Criar objetos de teste (tarefas)
    const task1 = { id: 1, title: 'Corrigir bug crítico' };
    const task2 = { id: 2, title: 'Implementar nova feature' };
    const task3 = { id: 3, title: 'Atualizar documentação' };
    const task4 = { id: 4, title: 'Otimizar performance' };
    
    // Criar objetos de teste (utilizadores VIP)
    const vip1 = { id: 101, name: 'Cliente VIP 1', level: 'platinum' };
    const vip2 = { id: 102, name: 'Cliente VIP 2', level: 'gold' };
    
    console.log("⭐ Definindo prioridades de tarefas:");
    
    priorityManager.setPriority(task1, 10);
    priorityManager.setPriority(task2, 5);
    priorityManager.setPriority(task3, 2);
    priorityManager.setPriority(task4, 8);
    
    console.log(`   "${task1.title}" - Prioridade: ${priorityManager.getPriority(task1)}`);
    console.log(`   "${task2.title}" - Prioridade: ${priorityManager.getPriority(task2)}`);
    console.log(`   "${task3.title}" - Prioridade: ${priorityManager.getPriority(task3)}`);
    console.log(`   "${task4.title}" - Prioridade: ${priorityManager.getPriority(task4)}`);
    
    console.log("");
    console.log("👑 Definindo níveis de VIP:");
    
    priorityManager.setPriority(vip1, 100);
    priorityManager.setPriority(vip2, 75);
    
    console.log(`   ${vip1.name} (${vip1.level}) - Nível: ${priorityManager.getPriority(vip1)}`);
    console.log(`   ${vip2.name} (${vip2.level}) - Nível: ${priorityManager.getPriority(vip2)}`);
    
    console.log("");
    console.log("🔍 Consultas:");
    
    const highest = priorityManager.getHighestPriority();
    const lowest = priorityManager.getLowestPriority();
    console.log(`   Item com maior prioridade: ${(highest as any).name || (highest as any).title} (${priorityManager.getPriority(highest!)})`);
    console.log(`   Item com menor prioridade: ${(lowest as any).name || (lowest as any).title} (${priorityManager.getPriority(lowest!)})`);
    
    console.log("");
    console.log("📊 Estatísticas de prioridades:");
    
    const stats = priorityManager.getStats();
    console.log(`   Total de items: ${stats.total}`);
    console.log(`   Prioridade média: ${stats.average.toFixed(2)}`);
    console.log(`   Maior prioridade: ${stats.highest}`);
    console.log(`   Menor prioridade: ${stats.lowest}`);
    
    console.log("");
    console.log("📋 Items ordenados por prioridade (decrescente):");
    
    const sorted = priorityManager.sortByPriority();
    sorted.forEach((item: any, index) => {
        const label = item.name || item.title;
        const priority = priorityManager.getPriority(item);
        console.log(`   ${index + 1}. ${label} - Prioridade: ${priority}`);
    });
    
    console.log("");
    console.log("🎯 Items com prioridade >= 5:");
    
    const highPriority = priorityManager.getByPriorityThreshold(5);
    highPriority.forEach((item: any) => {
        const label = item.name || item.title;
        const priority = priorityManager.getPriority(item);
        console.log(`   ✓ ${label} (${priority})`);
    });
    
    console.log("");
    console.log("📈 Ajustando prioridades:");
    
    console.log(`   "${task3.title}" antes: ${priorityManager.getPriority(task3)}`);
    priorityManager.increasePriority(task3, 5);
    console.log(`   "${task3.title}" depois de aumentar 5: ${priorityManager.getPriority(task3)}`);
    
    console.log(`   "${task2.title}" antes: ${priorityManager.getPriority(task2)}`);
    priorityManager.decreasePriority(task2, 2);
    console.log(`   "${task2.title}" depois de diminuir 2: ${priorityManager.getPriority(task2)}`);
    
    console.log("");
    
    SystemLogger.log("[PriorityManager] Todos os testes executados com sucesso");
}

/**
 * FASE 15: TESTE DO RATINGSYSTEM
 * Sistema genérico de avaliações (ratings)
 */
function phase15TestRatingSystem(): void {
    console.log("=== FASE 15: SISTEMA DE AVALIAÇÕES (RATINGSYSTEM) ===\n");
    
    const ratingSystem = new RatingSystem<any>();
    
    // Criar objetos de teste (tarefas)
    const task1 = { id: 1, title: 'Implementar autenticação' };
    const task2 = { id: 2, title: 'Corrigir bug de layout' };
    const task3 = { id: 3, title: 'Otimizar performance' };
    
    // Criar objetos de teste (utilizadores)
    const user1 = { id: 101, name: 'João Silva' };
    const user2 = { id: 102, name: 'Maria Santos' };
    
    console.log("⭐ Adicionando avaliações a tarefas:");
    
    // Avaliações para task1
    ratingSystem.rate(task1, 5);
    ratingSystem.rate(task1, 4);
    ratingSystem.rate(task1, 5);
    console.log(`   "${task1.title}"`);
    console.log(`      Avaliações: [${ratingSystem.getRatings(task1).join(', ')}]`);
    console.log(`      Média: ${ratingSystem.getAverage(task1)} ⭐`);
    console.log(`      Total de avaliações: ${ratingSystem.getCount(task1)}`);
    
    // Avaliações para task2
    ratingSystem.rate(task2, 3);
    ratingSystem.rate(task2, 2);
    ratingSystem.rate(task2, 3);
    ratingSystem.rate(task2, 4);
    console.log(`   "${task2.title}"`);
    console.log(`      Avaliações: [${ratingSystem.getRatings(task2).join(', ')}]`);
    console.log(`      Média: ${ratingSystem.getAverage(task2)} ⭐`);
    console.log(`      Total de avaliações: ${ratingSystem.getCount(task2)}`);
    
    // Avaliações para task3
    ratingSystem.rate(task3, 5);
    ratingSystem.rate(task3, 5);
    console.log(`   "${task3.title}"`);
    console.log(`      Avaliações: [${ratingSystem.getRatings(task3).join(', ')}]`);
    console.log(`      Média: ${ratingSystem.getAverage(task3)} ⭐`);
    console.log(`      Total de avaliações: ${ratingSystem.getCount(task3)}`);
    
    console.log("");
    console.log("👤 Adicionando avaliações a utilizadores:");
    
    // Avaliações para user1
    ratingSystem.rate(user1, 4);
    ratingSystem.rate(user1, 5);
    ratingSystem.rate(user1, 4);
    console.log(`   ${user1.name}`);
    console.log(`      Avaliações: [${ratingSystem.getRatings(user1).join(', ')}]`);
    console.log(`      Média: ${ratingSystem.getAverage(user1)} ⭐`);
    
    // Avaliações para user2
    ratingSystem.rate(user2, 2);
    ratingSystem.rate(user2, 3);
    console.log(`   ${user2.name}`);
    console.log(`      Avaliações: [${ratingSystem.getRatings(user2).join(', ')}]`);
    console.log(`      Média: ${ratingSystem.getAverage(user2)} ⭐`);
    
    console.log("");
    console.log("🔍 Análise de avaliações:");
    
    const max1 = ratingSystem.getMaxRating(task1);
    const min1 = ratingSystem.getMinRating(task1);
    console.log(`   "${task1.title}" - Máxima: ${max1}, Mínima: ${min1}`);
    
    const distribution = ratingSystem.getDistribution(task1);
    console.log(`   Distribuição de avaliações de "${task1.title}":`);
    console.log(`      1 estrela: ${distribution[1]}`);
    console.log(`      2 estrelas: ${distribution[2]}`);
    console.log(`      3 estrelas: ${distribution[3]}`);
    console.log(`      4 estrelas: ${distribution[4]}`);
    console.log(`      5 estrelas: ${distribution[5]}`);
    
    console.log("");
    console.log("📊 Ordenação por média (maior primeiro):");
    
    const sorted = ratingSystem.sortByAverage();
    sorted.forEach((item: any, index) => {
        const label = item.name || item.title;
        const average = ratingSystem.getAverage(item);
        console.log(`   ${index + 1}. ${label} - ${average} ⭐ (${ratingSystem.getCount(item)} avaliações)`);
    });
    
    console.log("");
    console.log("🎯 Items com média >= 4 estrelas:");
    
    const topRated = ratingSystem.getByMinAverage(4);
    topRated.forEach((item: any) => {
        const label = item.name || item.title;
        const average = ratingSystem.getAverage(item);
        console.log(`   ✓ ${label} (${average} ⭐)`);
    });
    
    console.log("");
    console.log("📈 Estatísticas gerais:");
    
    const stats = ratingSystem.getGeneralStats();
    console.log(`   Total de avaliações: ${stats.totalRatings}`);
    console.log(`   Items avaliados: ${stats.itemsRated}`);
    console.log(`   Média geral: ${stats.averageRating} ⭐`);
    console.log(`   Maior média: ${stats.highestAverage} ⭐`);
    console.log(`   Menor média: ${stats.lowestAverage} ⭐`);
    
    console.log("");
    
    SystemLogger.log("[RatingSystem] Todos os testes executados com sucesso");
}

/**
 * FASE 16: TESTE DO DEPENDENCYGRAPH
 * Sistema genérico de dependências entre entidades
 */
function phase16TestDependencyGraph(): void {
    console.log("=== FASE 16: SISTEMA DE DEPENDÊNCIAS (DEPENDENCYGRAPH) ===\n");
    
    const depGraph = new DependencyGraph<any>();
    
    // Criar objetos de teste (tarefas)
    const task1 = { id: 1, title: 'Configurar ambiente' };
    const task2 = { id: 2, title: 'Implementar API' };
    const task3 = { id: 3, title: 'Criar testes unitários' };
    const task4 = { id: 4, title: 'Documentação' };
    const task5 = { id: 5, title: 'Deploy' };
    
    console.log("📊 Criando grafo de dependências:");
    console.log("   Estrutura:");
    console.log("   Task1 (Ambiente) <- nenhuma");
    console.log("   Task2 (API) <- depende de Task1");
    console.log("   Task3 (Testes) <- depende de Task2");
    console.log("   Task4 (Docs) <- depende de Task2");
    console.log("   Task5 (Deploy) <- depende de Task3 e Task4");
    console.log("");
    
    // Construir grafo de dependências
    depGraph.addDependency(task2, task1);           
    depGraph.addDependency(task3, task2);           
    depGraph.addDependency(task4, task2);           
    depGraph.addDependency(task5, task3);           
    depGraph.addDependency(task5, task4);           
    
    console.log("🔍 Análise de dependências:");
    
    console.log(`   "${task1.title}" depende de: [${depGraph.getDependencies(task1).map((t: any) => t.title).join(', ') || 'nenhuma'}]`);
    console.log(`   "${task2.title}" depende de: [${depGraph.getDependencies(task2).map((t: any) => t.title).join(', ')}]`);
    console.log(`   "${task3.title}" depende de: [${depGraph.getDependencies(task3).map((t: any) => t.title).join(', ')}]`);
    console.log(`   "${task4.title}" depende de: [${depGraph.getDependencies(task4).map((t: any) => t.title).join(', ')}]`);
    console.log(`   "${task5.title}" depende de: [${depGraph.getDependencies(task5).map((t: any) => t.title).join(', ')}]`);
    
    console.log("");
    console.log("👁️  Itens dependentes (que dependem deste):");
    
    const deps1 = depGraph.getDependents(task1);
    console.log(`   "${task1.title}" é dependência de: [${deps1.map((t: any) => t.title).join(', ') || 'nenhuma'}]`);
    
    const deps2 = depGraph.getDependents(task2);
    console.log(`   "${task2.title}" é dependência de: [${deps2.map((t: any) => t.title).join(', ')}]`);
    
    console.log("");
    console.log("📈 Profundidade de dependências:");
    
    console.log(`   "${task1.title}" - Profundidade: ${depGraph.getDependencyDepth(task1)}`);
    console.log(`   "${task2.title}" - Profundidade: ${depGraph.getDependencyDepth(task2)}`);
    console.log(`   "${task3.title}" - Profundidade: ${depGraph.getDependencyDepth(task3)}`);
    console.log(`   "${task4.title}" - Profundidade: ${depGraph.getDependencyDepth(task4)}`);
    console.log(`   "${task5.title}" - Profundidade: ${depGraph.getDependencyDepth(task5)}`);
    
    console.log("");
    console.log("🔄 Dependências transitivas:");
    
    const allDeps5 = depGraph.getAllDependencies(task5);
    console.log(`   "${task5.title}" depende (total) de: [${allDeps5.map((t: any) => t.title).join(', ')}]`);
    console.log(`   Contagem: ${depGraph.getTotalDependencyCount(task5)} items`);
    
    const allDeps3 = depGraph.getAllDependencies(task3);
    console.log(`   "${task3.title}" depende (total) de: [${allDeps3.map((t: any) => t.title).join(', ')}]`);
    console.log(`   Contagem: ${depGraph.getTotalDependencyCount(task3)} items`);
    
    console.log("");
    console.log("🎯 Tarefas raiz (sem dependências):");
    
    const roots = depGraph.getRootItems();
    roots.forEach((item: any) => {
        console.log(`   ✓ "${item.title}"`);
    });
    
    console.log("");
    console.log("✅ Verificações:");
    
    console.log(`   "${task1.title}" tem dependências? ${depGraph.hasDependencies(task1) ? 'Sim' : 'Não'}`);
    console.log(`   "${task3.title}" tem dependências? ${depGraph.hasDependencies(task3) ? 'Sim' : 'Não'}`);
    console.log(`   Existe ciclo no grafo? ${depGraph.hasCycle(task1) ? 'Sim (ERRO!)' : 'Não ✓'}`);
    
    console.log("");
    console.log("📋 Ordem de execução (topológica):");
    
    try {
        const sorted = depGraph.topologicalSort();
        sorted.forEach((item: any, index) => {
            console.log(`   ${index + 1}. "${item.title}"`);
        });
    } catch (error: any) {
        console.log(`   ❌ Erro: ${error.message}`);
    }
    
    console.log("");
    
    SystemLogger.log("[DependencyGraph] Todos os testes executados com sucesso");
}

/**
 * Executa todas as fases de demonstração
 */
export function runAllSystemDemonstration(): void {
    console.log("\n");
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║   SISTEMA DE GESTÃO - ESCRITÓRIO DE ADVOCACIA             ║");
    console.log("║   Demonstração de Integração de Serviços Estáticos        ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log("\n");
    
    phase8TestEntityList();
    phase9TestSimpleCache();
    phase10TestFavorites();
    phase11TestPaginator();
    phase12TestTagManager();
    phase13TestWatcherSystem();
    phase14TestPriorityManager();
    phase15TestRatingSystem();
    phase16TestDependencyGraph();
    phase1InitializeSystem();
    phase2DemonstrateIdGeneration();
    phase3DemonstrateValidations();
    phase4DemonstrateBusinessRules();
    phase5DemonstrateCompleteFlow();
    phase6DisplayLogsReport();
    phase7DisplayFinalStatistics();
    
    console.log("═══════════════════════════════════════════════════════════════");
    console.log("");
    
    SystemLogger.log("[Sistema] Demonstração concluída com sucesso");
}

// Exposição das funções individuais para testes manuais (opcional)
export {
    phase1InitializeSystem,
    phase2DemonstrateIdGeneration,
    phase3DemonstrateValidations,
    phase4DemonstrateBusinessRules,
    phase5DemonstrateCompleteFlow,
    phase6DisplayLogsReport,
    phase7DisplayFinalStatistics,
    phase8TestEntityList,
    phase9TestSimpleCache,
    phase10TestFavorites,
    phase11TestPaginator,
    phase12TestTagManager,
    phase13TestWatcherSystem,
    phase14TestPriorityManager,
    phase15TestRatingSystem,
    phase16TestDependencyGraph
};
