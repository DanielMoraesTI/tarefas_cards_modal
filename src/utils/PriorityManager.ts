/**
 * PriorityManager - Sistema genérico de prioridades
 * Associa prioridade numérica a qualquer tipo de entidade
 * Número maior = maior prioridade
 */
export class PriorityManager<T> {
    private priorities: Map<T, number>;

    constructor() {
        this.priorities = new Map();
    }

    /**
     * Define a prioridade de um item
     * @param item - O item ao qual definir prioridade
     * @param value - Valor numérico da prioridade (número maior = maior prioridade)
     */
    setPriority(item: T, value: number): void {
        if (value < 0) {
            throw new Error("Prioridade não pode ser negativa");
        }
        this.priorities.set(item, value);
    }

    /**
     * Obtém a prioridade de um item
     * @param item - O item do qual obter a prioridade
     * @returns Valor numérico da prioridade, ou undefined se não definida
     */
    getPriority(item: T): number | undefined {
        return this.priorities.get(item);
    }

    /**
     * Retorna todas as prioridades
     * @returns Map com todos os items e suas prioridades
     */
    getAll(): Map<T, number> {
        return new Map(this.priorities);
    }

    /**
     * Remove a prioridade de um item
     * @param item - O item do qual remover a prioridade
     */
    removePriority(item: T): void {
        this.priorities.delete(item);
    }

    /**
     * Verifica se um item tem prioridade definida
     * @param item - O item a verificar
     * @returns true se tem prioridade, false caso contrário
     */
    hasPriority(item: T): boolean {
        return this.priorities.has(item);
    }

    /**
     * Aumenta a prioridade de um item
     * @param item - O item
     * @param increment - Valor a incrementar (default: 1)
     */
    increasePriority(item: T, increment: number = 1): void {
        const current = this.priorities.get(item) ?? 0;
        this.setPriority(item, current + increment);
    }

    /**
     * Diminui a prioridade de um item
     * @param item - O item
     * @param decrement - Valor a decrementar (default: 1)
     */
    decreasePriority(item: T, decrement: number = 1): void {
        const current = this.priorities.get(item) ?? 0;
        this.setPriority(item, Math.max(0, current - decrement));
    }

    /**
     * Retorna o item com maior prioridade
     * @returns Item com maior prioridade, ou undefined se nenhum item
     */
    getHighestPriority(): T | undefined {
        let highest: T | undefined = undefined;
        let maxValue = -1;

        this.priorities.forEach((value, item) => {
            if (value > maxValue) {
                maxValue = value;
                highest = item;
            }
        });

        return highest;
    }

    /**
     * Retorna o item com menor prioridade
     * @returns Item com menor prioridade, ou undefined se nenhum item
     */
    getLowestPriority(): T | undefined {
        let lowest: T | undefined = undefined;
        let minValue = Infinity;

        this.priorities.forEach((value, item) => {
            if (value < minValue) {
                minValue = value;
                lowest = item;
            }
        });

        return lowest;
    }

    /**
     * Ordena items por prioridade (decrescente)
     * @returns Array de items ordenado por prioridade
     */
    sortByPriority(): T[] {
        return Array.from(this.priorities.entries())
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);
    }

    /**
     * Obtém items com prioridade acima de um valor
     * @param threshold - Valor mínimo de prioridade
     * @returns Array de items com prioridade >= threshold
     */
    getByPriorityThreshold(threshold: number): T[] {
        return Array.from(this.priorities.entries())
            .filter(([_, priority]) => priority >= threshold)
            .map(entry => entry[0]);
    }

    /**
     * Retorna o número de items com prioridades definidas
     * @returns Número de items
     */
    count(): number {
        return this.priorities.size;
    }

    /**
     * Limpa todas as prioridades
     */
    clear(): void {
        this.priorities.clear();
    }

    /**
     * Obtém informações sobre as prioridades
     * @returns Objeto com estatísticas
     */
    getStats(): {
        total: number;
        average: number;
        highest: number;
        lowest: number;
    } {
        if (this.priorities.size === 0) {
            return { total: 0, average: 0, highest: 0, lowest: 0 };
        }

        const values = Array.from(this.priorities.values());
        const total = values.reduce((a, b) => a + b, 0);
        const average = total / values.length;
        const highest = Math.max(...values);
        const lowest = Math.min(...values);

        return { total, average, highest, lowest };
    }
}
