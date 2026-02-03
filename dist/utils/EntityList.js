/**
 * EntityList - Lista Genérica de Entidades
 *
 * Estrutura reutilizável para armazenar qualquer tipo de entidade.
 * Usa generics <T> para suportar utilizadores, tarefas ou qualquer objeto.
 *
 * @template T - Tipo da entidade que será armazenada na lista
 *
 * @example
 * // Lista de usuários
 * const userList = new EntityList<UserClass>();
 * userList.add(user1);
 * userList.add(user2);
 * console.log(userList.getAll()); // [user1, user2]
 *
 * @example
 * // Lista de tarefas
 * const taskList = new EntityList<Task>();
 * taskList.add(task1);
 * console.log(taskList.getAll()); // [task1]
 */
export class EntityList {
    /**
     * Array interno para armazenar as entidades
     */
    items;
    /**
     * Construtor da lista genérica
     * Inicializa o array vazio
     */
    constructor() {
        this.items = [];
    }
    /**
     * Adiciona um item à lista
     * @param item - Entidade a ser adicionada
     *
     * @example
     * const list = new EntityList<User>();
     * list.add(newUser);
     */
    add(item) {
        this.items.push(item);
    }
    /**
     * Retorna todos os itens da lista
     * @returns Array com todas as entidades
     *
     * @example
     * const allUsers = userList.getAll();
     */
    getAll() {
        return this.items;
    }
    /**
     * MÉTODOS AUXILIARES (BÔNUS)
     * Funcionalidades adicionais úteis para manipulação de listas
     */
    /**
     * Remove um item da lista baseado em uma condição
     * @param predicate - Função que retorna true para o item a remover
     * @returns true se removeu, false caso contrário
     *
     * @example
     * userList.remove(user => user.id === 5);
     */
    remove(predicate) {
        const index = this.items.findIndex(predicate);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
    /**
     * Encontra um item na lista
     * @param predicate - Função que retorna true para o item procurado
     * @returns Item encontrado ou undefined
     *
     * @example
     * const user = userList.find(u => u.id === 3);
     */
    find(predicate) {
        return this.items.find(predicate);
    }
    /**
     * Filtra itens da lista
     * @param predicate - Função que retorna true para itens a incluir
     * @returns Array com itens filtrados
     *
     * @example
     * const activeUsers = userList.filter(u => u.isActive());
     */
    filter(predicate) {
        return this.items.filter(predicate);
    }
    /**
     * Retorna o número de itens na lista
     * @returns Quantidade de itens
     *
     * @example
     * console.log(`Total: ${userList.count()}`);
     */
    count() {
        return this.items.length;
    }
    /**
     * Verifica se a lista está vazia
     * @returns true se vazia, false caso contrário
     *
     * @example
     * if (taskList.isEmpty()) {
     *     console.log("Nenhuma tarefa!");
     * }
     */
    isEmpty() {
        return this.items.length === 0;
    }
    /**
     * Limpa todos os itens da lista
     *
     * @example
     * userList.clear();
     */
    clear() {
        this.items = [];
    }
    /**
     * Verifica se um item existe na lista
     * @param predicate - Função que retorna true para o item procurado
     * @returns true se existe, false caso contrário
     *
     * @example
     * const exists = userList.exists(u => u.email === "test@email.com");
     */
    exists(predicate) {
        return this.items.some(predicate);
    }
    /**
     * Ordena a lista baseado em um critério
     * @param compareFn - Função de comparação
     * @returns Lista ordenada (não modifica a original)
     *
     * @example
     * const sorted = userList.sort((a, b) => a.name.localeCompare(b.name));
     */
    sort(compareFn) {
        return [...this.items].sort(compareFn);
    }
    /**
     * Mapeia os itens para outro tipo
     * @param mapFn - Função de mapeamento
     * @returns Array com itens mapeados
     *
     * @example
     * const names = userList.map(u => u.name);
     */
    map(mapFn) {
        return this.items.map(mapFn);
    }
    /**
     * Obtém item por índice
     * @param index - Índice do item
     * @returns Item no índice ou undefined
     *
     * @example
     * const firstUser = userList.getAt(0);
     */
    getAt(index) {
        return this.items[index];
    }
    /**
     * Obtém o primeiro item da lista
     * @returns Primeiro item ou undefined se lista vazia
     *
     * @example
     * const first = userList.first();
     */
    first() {
        return this.items[0];
    }
    /**
     * Obtém o último item da lista
     * @returns Último item ou undefined se lista vazia
     *
     * @example
     * const last = userList.last();
     */
    last() {
        return this.items[this.items.length - 1];
    }
}
