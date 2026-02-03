/**
 * DependencyGraph - Sistema genérico de dependências
 * Modela dependências entre entidades (ex: tarefas dependem de outras tarefas)
 */
export class DependencyGraph<T> {
    private graph: Map<T, T[]>;

    constructor() {
        this.graph = new Map();
    }

    /**
     * Adiciona uma dependência entre dois itens
     * @param item - O item que depende
     * @param dependsOn - O item do qual item depende
     */
    addDependency(item: T, dependsOn: T): void {
        if (!this.graph.has(item)) {
            this.graph.set(item, []);
        }

        const dependencies = this.graph.get(item)!;
        if (!dependencies.includes(dependsOn)) {
            dependencies.push(dependsOn);
        }
    }

    /**
     * Retorna todas as dependências diretas de um item
     * @param item - O item
     * @returns Array de itens dos quais item depende, ou array vazio
     */
    getDependencies(item: T): T[] {
        if (!this.graph.has(item)) {
            return [];
        }
        return [...this.graph.get(item)!];
    }

    /**
     * Verifica se um item tem dependências
     * @param item - O item
     * @returns true se tem dependências, false caso contrário
     */
    hasDependencies(item: T): boolean {
        if (!this.graph.has(item)) {
            return false;
        }
        return this.graph.get(item)!.length > 0;
    }

    /**
     * Remove uma dependência entre dois itens
     * @param item - O item que depende
     * @param dependsOn - A dependência a remover
     */
    removeDependency(item: T, dependsOn: T): void {
        if (!this.graph.has(item)) {
            return;
        }

        const dependencies = this.graph.get(item)!;
        const index = dependencies.indexOf(dependsOn);
        if (index > -1) {
            dependencies.splice(index, 1);
        }
    }

    /**
     * Retorna todos os itens que dependem de um item específico (dependentes)
     * @param item - O item
     * @returns Array de itens que dependem deste item
     */
    getDependents(item: T): T[] {
        const dependents: T[] = [];
        this.graph.forEach((dependencies, dependent) => {
            if (dependencies.includes(item)) {
                dependents.push(dependent);
            }
        });
        return dependents;
    }

    /**
     * Obtém todas as dependências recursivas (transitividade)
     * @param item - O item
     * @param visited - Set interno para rastrear ciclos
     * @returns Array de todas as dependências (diretas e indiretas)
     */
    getAllDependencies(item: T, visited: Set<T> = new Set()): T[] {
        const allDeps: T[] = [];
        visited.add(item);

        const directDeps = this.getDependencies(item);
        directDeps.forEach(dep => {
            if (!visited.has(dep)) {
                allDeps.push(dep);
                const transitiveDeps = this.getAllDependencies(dep, visited);
                allDeps.push(...transitiveDeps);
            }
        });

        return allDeps;
    }

    /**
     * Verifica se há ciclos (dependências circulares)
     * @param item - O item para iniciar verificação
     * @param visited - Set interno para rastreamento
     * @param recursionStack - Set interno para detecção de ciclos
     * @returns true se há ciclo, false caso contrário
     */
    hasCycle(item: T, visited: Set<T> = new Set(), recursionStack: Set<T> = new Set()): boolean {
        visited.add(item);
        recursionStack.add(item);

        const dependencies = this.getDependencies(item);
        for (const dep of dependencies) {
            if (!visited.has(dep)) {
                if (this.hasCycle(dep, visited, recursionStack)) {
                    return true;
                }
            } else if (recursionStack.has(dep)) {
                return true;
            }
        }

        recursionStack.delete(item);
        return false;
    }

    /**
     * Retorna a profundidade de dependências de um item
     * @param item - O item
     * @returns Número que representa a profundidade máxima
     */
    getDependencyDepth(item: T): number {
        const dependencies = this.getDependencies(item);
        if (dependencies.length === 0) {
            return 0;
        }

        let maxDepth = 0;
        dependencies.forEach(dep => {
            const depth = this.getDependencyDepth(dep);
            maxDepth = Math.max(maxDepth, depth);
        });

        return maxDepth + 1;
    }

    /**
     * Obtém o número de dependências diretas de um item
     * @param item - O item
     * @returns Número de dependências diretas
     */
    getDependencyCount(item: T): number {
        return this.getDependencies(item).length;
    }

    /**
     * Retorna o número total de dependências (diretas e indiretas)
     * @param item - O item
     * @returns Número total de dependências únicas
     */
    getTotalDependencyCount(item: T): number {
        return new Set(this.getAllDependencies(item)).size;
    }

    /**
     * Remove um item e todas suas dependências
     * @param item - O item a remover
     */
    removeItem(item: T): void {
        this.graph.delete(item);
        this.graph.forEach(dependencies => {
            const index = dependencies.indexOf(item);
            if (index > -1) {
                dependencies.splice(index, 1);
            }
        });
    }

    /**
     * Retorna todos os itens que não têm dependências (tarefas raiz)
     * @returns Array de items sem dependências
     */
    getRootItems(): T[] {
        const roots: T[] = [];
        this.graph.forEach((dependencies, item) => {
            if (dependencies.length === 0) {
                roots.push(item);
            }
        });
        return roots;
    }

    /**
     * Retorna todos os itens no grafo
     * @returns Array de todos os items
     */
    getAllItems(): T[] {
        return Array.from(this.graph.keys());
    }

    /**
     * Retorna o grafo completo
     * @returns Map com todas as dependências
     */
    getGraph(): Map<T, T[]> {
        return new Map(this.graph);
    }

    /**
     * Ordena items por ordem de execução (dependências primeiro)
     * @returns Array de items ordenado topologicamente
     */
    topologicalSort(): T[] {
        const sorted: T[] = [];
        const visited = new Set<T>();
        const visiting = new Set<T>();

        const visit = (item: T) => {
            if (visited.has(item)) return;
            if (visiting.has(item)) throw new Error("Ciclo detectado no grafo de dependências");

            visiting.add(item);

            const dependencies = this.getDependencies(item);
            dependencies.forEach(dep => visit(dep));

            visiting.delete(item);
            visited.add(item);
            sorted.push(item);
        };

        this.graph.forEach((_, item) => {
            visit(item);
        });

        return sorted;
    }

    clear(): void {
        this.graph.clear();
    }
}
