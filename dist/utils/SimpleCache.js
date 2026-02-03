/**
 * SimpleCache - Cache Genérico por ID
 *
 * Estrutura reutilizável para cachear entidades por chave (ID).
 * Usa generics <K, T> onde:
 * - K = tipo da chave (geralmente number para IDs)
 * - T = tipo do valor (User, Task, etc.)
 *
 * Utiliza Map<K, T> internamente para armazenamento eficiente.
 *
 * @template K - Tipo da chave (ex: number, string)
 * @template T - Tipo do valor a ser cacheado
 *
 * @example
 * // Cache de usuários por ID
 * const userCache = new SimpleCache<number, UserClass>();
 * userCache.set(1, user1);
 * const user = userCache.get(1); // UserClass | undefined
 *
 * @example
 * // Cache de tarefas por ID
 * const taskCache = new SimpleCache<number, Task>();
 * taskCache.set(10, task1);
 * const task = taskCache.get(10); // Task | undefined
 */
export class SimpleCache {
    /**
     * Map interno para armazenar o cache
     * K = chave (ID)
     * T = valor (entidade)
     */
    cache;
    /**
     * Construtor do cache
     * Inicializa o Map vazio
     */
    constructor() {
        this.cache = new Map();
    }
    /**
     * Adiciona ou atualiza um valor no cache
     *
     * @param key - Chave (ID) do item
     * @param value - Valor a ser cacheado
     *
     * @example
     * userCache.set(1, user1);
     * userCache.set(2, user2);
     */
    set(key, value) {
        this.cache.set(key, value);
    }
    /**
     * Obtém um valor do cache pela chave
     *
     * @param key - Chave (ID) do item
     * @returns Valor cacheado ou undefined se não existir
     *
     * @example
     * const user = userCache.get(1); // UserClass | undefined
     * if (user) {
     *     console.log(user.name);
     * }
     */
    get(key) {
        return this.cache.get(key);
    }
    /**
     * MÉTODOS AUXILIARES (BÔNUS)
     * Funcionalidades adicionais para gerenciamento do cache
     */
    /**
     * Verifica se uma chave existe no cache
     *
     * @param key - Chave a verificar
     * @returns true se existe, false caso contrário
     *
     * @example
     * if (userCache.has(1)) {
     *     console.log("Usuário está no cache!");
     * }
     */
    has(key) {
        return this.cache.has(key);
    }
    /**
     * Remove um item do cache
     *
     * @param key - Chave do item a remover
     * @returns true se removeu, false se não existia
     *
     * @example
     * const removed = userCache.delete(1);
     * console.log(removed ? "Removido" : "Não existia");
     */
    delete(key) {
        return this.cache.delete(key);
    }
    /**
     * Limpa todo o cache
     *
     * @example
     * userCache.clear();
     * console.log(userCache.size()); // 0
     */
    clear() {
        this.cache.clear();
    }
    /**
     * Retorna o número de itens no cache
     *
     * @returns Quantidade de itens cacheados
     *
     * @example
     * console.log(`Itens no cache: ${userCache.size()}`);
     */
    size() {
        return this.cache.size;
    }
    /**
     * Retorna todas as chaves do cache
     *
     * @returns Array com todas as chaves
     *
     * @example
     * const ids = userCache.keys();
     * console.log("IDs cacheados:", ids);
     */
    keys() {
        return Array.from(this.cache.keys());
    }
    /**
     * Retorna todos os valores do cache
     *
     * @returns Array com todos os valores
     *
     * @example
     * const allUsers = userCache.values();
     * console.log("Usuários:", allUsers);
     */
    values() {
        return Array.from(this.cache.values());
    }
    /**
     * Retorna todos os pares chave-valor
     *
     * @returns Array de tuplas [chave, valor]
     *
     * @example
     * const entries = userCache.entries();
     * entries.forEach(([id, user]) => {
     *     console.log(`${id}: ${user.name}`);
     * });
     */
    entries() {
        return Array.from(this.cache.entries());
    }
    /**
     * Itera sobre todos os itens do cache
     *
     * @param callback - Função a executar para cada item
     *
     * @example
     * userCache.forEach((user, id) => {
     *     console.log(`User ${id}: ${user.name}`);
     * });
     */
    forEach(callback) {
        this.cache.forEach(callback);
    }
    /**
     * Verifica se o cache está vazio
     *
     * @returns true se vazio, false caso contrário
     *
     * @example
     * if (userCache.isEmpty()) {
     *     console.log("Cache vazio!");
     * }
     */
    isEmpty() {
        return this.cache.size === 0;
    }
    /**
     * Obtém um valor ou define um padrão se não existir
     *
     * @param key - Chave do item
     * @param defaultValue - Valor padrão se não existir
     * @returns Valor do cache ou valor padrão
     *
     * @example
     * const user = userCache.getOrDefault(999, defaultUser);
     */
    getOrDefault(key, defaultValue) {
        return this.cache.get(key) ?? defaultValue;
    }
    /**
     * Adiciona múltiplos itens ao cache de uma vez
     *
     * @param entries - Array de tuplas [chave, valor]
     *
     * @example
     * userCache.setMany([
     *     [1, user1],
     *     [2, user2],
     *     [3, user3]
     * ]);
     */
    setMany(entries) {
        entries.forEach(([key, value]) => {
            this.cache.set(key, value);
        });
    }
    /**
     * Obtém múltiplos valores de uma vez
     *
     * @param keys - Array de chaves
     * @returns Array de valores (undefined para chaves não encontradas)
     *
     * @example
     * const users = userCache.getMany([1, 2, 3]);
     */
    getMany(keys) {
        return keys.map(key => this.cache.get(key));
    }
    /**
     * Remove múltiplos itens de uma vez
     *
     * @param keys - Array de chaves a remover
     * @returns Número de itens removidos
     *
     * @example
     * const removed = userCache.deleteMany([1, 2, 3]);
     * console.log(`${removed} itens removidos`);
     */
    deleteMany(keys) {
        let count = 0;
        keys.forEach(key => {
            if (this.cache.delete(key)) {
                count++;
            }
        });
        return count;
    }
    /**
     * Converte o cache para objeto JavaScript
     * (útil para serialização)
     *
     * @returns Objeto com pares chave-valor
     *
     * @example
     * const obj = userCache.toObject();
     * console.log(JSON.stringify(obj));
     */
    toObject() {
        const obj = {};
        this.cache.forEach((value, key) => {
            obj[String(key)] = value;
        });
        return obj;
    }
    /**
     * Cria um cache a partir de um array de itens
     *
     * @param items - Array de itens
     * @param keyExtractor - Função para extrair a chave de cada item
     * @returns Nova instância de SimpleCache
     *
     * @example
     * const cache = SimpleCache.fromArray(users, user => user.id);
     */
    static fromArray(items, keyExtractor) {
        const cache = new SimpleCache();
        items.forEach(item => {
            cache.set(keyExtractor(item), item);
        });
        return cache;
    }
}
