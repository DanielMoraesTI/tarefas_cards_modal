/**
 * Gerencia o toggle entre visualização de Utilizadores e Tarefas
 * Mantém todas as funcionalidades de ambos os painéis
 */

export class ViewToggle {
    private currentView: 'users' | 'tasks' = 'users';
    private dashboardContainer: HTMLElement;
    private usersColumn: HTMLElement;
    private tasksColumn: HTMLElement;
    private btnViewUsers: HTMLButtonElement;
    private btnViewTasks: HTMLButtonElement;

    constructor() {
        this.dashboardContainer = document.querySelector('.dashboard-container') as HTMLElement;
        this.usersColumn = document.querySelector('#col-users') as HTMLElement;
        this.tasksColumn = document.querySelector('#col-tasks') as HTMLElement;
        this.btnViewUsers = document.querySelector('#btnViewUsers') as HTMLButtonElement;
        this.btnViewTasks = document.querySelector('#btnViewTasks') as HTMLButtonElement;

        if (!this.dashboardContainer || !this.usersColumn || !this.tasksColumn) {
            console.warn('ViewToggle: Elementos de coluna não encontrados');
            return;
        }

        this.setupEventListeners();
        this.initializeView();
    }

    private setupEventListeners(): void {
        this.btnViewUsers.addEventListener('click', () => this.switchToUsers());
        this.btnViewTasks.addEventListener('click', () => this.switchToTasks());
    }

    private initializeView(): void {
        // Inicia com a visualização de usuários
        // Aplicar estilos iniciais
        this.dashboardContainer.classList.add('single-view');
        this.btnViewUsers.classList.add('toggle-btn-active');
        this.btnViewTasks.classList.remove('toggle-btn-active');
        this.tasksColumn.classList.add('hidden-column');
        this.usersColumn.classList.remove('hidden-column');
        
        console.log('📊 Inicializado em: UTILIZADORES');
    }

    private switchToUsers(): void {
        if (this.currentView === 'users') return;

        this.currentView = 'users';

        this.btnViewUsers.classList.add('toggle-btn-active');
        this.btnViewTasks.classList.remove('toggle-btn-active');

        this.usersColumn.classList.remove('hidden-column');
        this.tasksColumn.classList.add('hidden-column');

        this.dashboardContainer.classList.add('single-view');

        console.log('📊 View alternada para: UTILIZADORES');
    }

    private switchToTasks(): void {
        if (this.currentView === 'tasks') return;

        this.currentView = 'tasks';

        this.btnViewUsers.classList.remove('toggle-btn-active');
        this.btnViewTasks.classList.add('toggle-btn-active');

        this.usersColumn.classList.add('hidden-column');
        this.tasksColumn.classList.remove('hidden-column');

        this.dashboardContainer.classList.add('single-view');

        console.log('📊 View alternada para: TAREFAS');
    }

    public getCurrentView(): 'users' | 'tasks' {
        return this.currentView;
    }

    public showUsers(): void {
        this.switchToUsers();
    }

    public showTasks(): void {
        this.switchToTasks();
    }
}
