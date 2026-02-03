/**
 * WatcherSystem - Sistema genérico de subscrições/watchers
 * Permite que utilizadores sigam (watch) tarefas e outros utilizadores
 */
export class WatcherSystem<T, U> {
    private watchers: Map<T, U[]>;

    constructor() {
        this.watchers = new Map();
    }

    /**
     * Adiciona um observador a uma entidade (watch)
     * @param target - A entidade a ser observada
     * @param user - O observador (utilizador)
     */
    watch(target: T, user: U): void {
        if (!this.watchers.has(target)) {
            this.watchers.set(target, []);
        }

        const watchersList = this.watchers.get(target)!;
        if (!watchersList.includes(user)) {
            watchersList.push(user);
        }
    }

    /**
     * Remove um observador de uma entidade (unwatch)
     * @param target - A entidade observada
     * @param user - O observador a remover
     */
    unwatch(target: T, user: U): void {
        if (!this.watchers.has(target)) {
            return;
        }

        const watchersList = this.watchers.get(target)!;
        const index = watchersList.indexOf(user);
        if (index > -1) {
            watchersList.splice(index, 1);
        }
    }

    /**
     * Retorna todos os observadores de uma entidade
     * @param target - A entidade observada
     * @returns Array de observadores, ou array vazio se não existem
     */
    getWatchers(target: T): U[] {
        if (!this.watchers.has(target)) {
            return [];
        }
        return [...this.watchers.get(target)!];
    }

    /**
     * Verifica se um utilizador está observando uma entidade
     * @param target - A entidade observada
     * @param user - O observador a verificar
     * @returns true se o utilizador está observando, false caso contrário
     */
    isWatching(target: T, user: U): boolean {
        if (!this.watchers.has(target)) {
            return false;
        }
        return this.watchers.get(target)!.includes(user);
    }

    /**
     * Retorna todas as entidades que um utilizador está observando
     * @param user - O utilizador
     * @returns Array de entidades observadas
     */
    getWatchedTargets(user: U): T[] {
        const targets: T[] = [];
        this.watchers.forEach((watchersList, target) => {
            if (watchersList.includes(user)) {
                targets.push(target);
            }
        });
        return targets;
    }

    /**
     * Remove todos os observadores de uma entidade
     * @param target - A entidade observada
     */
    clearWatchers(target: T): void {
        this.watchers.delete(target);
    }

    /**
     * Retorna o número de observadores de uma entidade
     * @param target - A entidade observada
     * @returns Número de observadores
     */
    getWatcherCount(target: T): number {
        if (!this.watchers.has(target)) {
            return 0;
        }
        return this.watchers.get(target)!.length;
    }

    /**
     * Notifica todos os observadores de uma entidade (padrão Observer)
     * @param target - A entidade
     * @param callback - Função a executar para cada observador
     */
    notifyWatchers(target: T, callback: (watcher: U) => void): void {
        const watchersList = this.getWatchers(target);
        watchersList.forEach(watcher => callback(watcher));
    }
}
