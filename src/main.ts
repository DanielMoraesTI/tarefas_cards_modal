/**
 * MAIN.TS - Ponto de Entrada da Aplicação
 * 
 * Responsabilidades:
 * - Inicializar a aplicação quando o DOM está pronto
 * - Executar demonstração dos serviços estáticos
 * - Expor funções globais para uso no HTML
 */

import { initializeApplication, openUserDetailsModal, openEditModal } from './app/initialization.js';
import { runAllSystemDemonstration } from './tests/systemDemonstration.js';
import { renderUsers, renderTasks, updateExtendedStatistics, renderDashboard } from './ui/index.js';

/**
 * Aguarda o DOM estar completamente carregado e inicializa a aplicação
 */
document.addEventListener('DOMContentLoaded', () => {
    // Executar demonstração dos serviços estáticos
    runAllSystemDemonstration();
    
    // Inicializar a aplicação
    initializeApplication();
});

/**
 * EXPOSIÇÃO DE FUNÇÕES GLOBAIS
 * Estas funções estão disponíveis para uso no HTML (onclick, etc)
 */

// Abre modal de detalhes do usuário
(window as any).abrirModalDetalhes = openUserDetailsModal;

// Refresca dados do modal de detalhes
(window as any).refreshModalData = (user: any) => openUserDetailsModal(user);

// Abre modal de edição de tarefa
(window as any).openEditModal = openEditModal;

// Atalho para abrir edição com apenas ID
(window as any).abrirModalEdicao = openEditModal;

// Exposição das funções de renderização
(window as any).renderUsers = renderUsers;
(window as any).renderTasks = renderTasks;
(window as any).updateStats = updateExtendedStatistics;
(window as any).renderDashboard = renderDashboard;

// Exposição da função de demonstração (para executar manualmente)
(window as any).runSystemDemo = runAllSystemDemonstration;

//Professor: Quando tirei todos os window as any, a aplicação parou de funcionar, precisei retornar por, após fracionar o arquivo único inicial ter variáveis globais que o TS não reconhece sem o window as any.