/**
 * Gerencia o toggle entre visualização de Utilizadores e Tarefas
 * Mantém todas as funcionalidades de ambos os painéis
 */
export class ViewToggle {
    currentView = 'users';
    dashboardContainer;
    usersColumn;
    tasksColumn;
    btnViewUsers;
    btnViewTasks;
    constructor() {
        this.dashboardContainer = document.querySelector('.dashboard-container');
        this.usersColumn = document.querySelector('#col-users');
        this.tasksColumn = document.querySelector('#col-tasks');
        this.btnViewUsers = document.querySelector('#btnViewUsers');
        this.btnViewTasks = document.querySelector('#btnViewTasks');
        if (!this.dashboardContainer || !this.usersColumn || !this.tasksColumn) {
            console.warn('ViewToggle: Elementos de coluna não encontrados');
            return;
        }
        this.setupEventListeners();
        this.initializeView();
    }
    setupEventListeners() {
        this.btnViewUsers.addEventListener('click', () => this.switchToUsers());
        this.btnViewTasks.addEventListener('click', () => this.switchToTasks());
    }
    initializeView() {
        // Inicia com a visualização de usuários
        // Aplicar estilos iniciais
        this.dashboardContainer.classList.add('single-view');
        this.btnViewUsers.classList.add('toggle-btn-active');
        this.btnViewTasks.classList.remove('toggle-btn-active');
        this.tasksColumn.classList.add('hidden-column');
        this.usersColumn.classList.remove('hidden-column');
        console.log('📊 Inicializado em: UTILIZADORES');
    }
    switchToUsers() {
        if (this.currentView === 'users')
            return;
        this.currentView = 'users';
        this.btnViewUsers.classList.add('toggle-btn-active');
        this.btnViewTasks.classList.remove('toggle-btn-active');
        this.usersColumn.classList.remove('hidden-column');
        this.tasksColumn.classList.add('hidden-column');
        this.dashboardContainer.classList.add('single-view');
        console.log('📊 View alternada para: UTILIZADORES');
    }
    switchToTasks() {
        if (this.currentView === 'tasks')
            return;
        this.currentView = 'tasks';
        this.btnViewUsers.classList.remove('toggle-btn-active');
        this.btnViewTasks.classList.add('toggle-btn-active');
        this.usersColumn.classList.add('hidden-column');
        this.tasksColumn.classList.remove('hidden-column');
        this.dashboardContainer.classList.add('single-view');
        console.log('📊 View alternada para: TAREFAS');
    }
    getCurrentView() {
        return this.currentView;
    }
    showUsers() {
        this.switchToUsers();
    }
    showTasks() {
        this.switchToTasks();
    }
}
