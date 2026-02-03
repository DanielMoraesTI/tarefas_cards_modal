/**
 * FAVORITES - Sistema Genérico de Favoritos
 * 
 * Permite adicionar, remover e gerenciar favoritos de qualquer tipo (genérico <T>).
 * Evita duplicados através de comparação por referência.
 * 
 * Casos de uso:
 * - Favoritos de usuários
 * - Favoritos de tarefas
 * - Favoritos de comentários
 * - Qualquer outro tipo de entidade
 */

export class Favorites<T> {
    private items: T[] = [];

    /**
     * Adiciona um item aos favoritos
     * Evita duplicados verificando se o item já existe
     * 
     * @param item - Item a ser adicionado
     */
    add(item: T): void {
        if (!this.exists(item)) {
            this.items.push(item);
        }
    }

    /**
     * Remove um item dos favoritos
     * Usa comparação por referência (===)
     * 
     * @param item - Item a ser removido
     * @returns true se foi removido, false se não existia
     */
    remove(item: T): boolean {
        const indexToRemove = this.items.findIndex(favItem => favItem === item);
        
        if (indexToRemove !== -1) {
            this.items.splice(indexToRemove, 1);
            return true;
        }
        
        return false;
    }

    /**
     * Verifica se um item existe nos favoritos
     * Usa comparação por referência (===)
     * 
     * @param item - Item a ser verificado
     * @returns true se existe, false caso contrário
     */
    exists(item: T): boolean {
        return this.items.some(favItem => favItem === item);
    }

    /**
     * Retorna todos os items favoritos
     * 
     * @returns Array com todos os items favoritos
     */
    getAll(): T[] {
        return [...this.items];
    }

    /**
     * Retorna a quantidade de items favoritos
     * 
     * @returns Número de items
     */
    count(): number {
        return this.items.length;
    }

    /**
     * Verifica se não há items favoritos
     * 
     * @returns true se vazio, false caso contrário
     */
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    /**
     * Limpa todos os favoritos
     */
    clear(): void {
        this.items = [];
    }

    /**
     * Remove todos os items de uma lista (útil para limpeza de dados)
     * 
     * @param items - Items a serem removidos
     */
    removeAll(items: T[]): void {
        items.forEach(item => this.remove(item));
    }
}

export default Favorites;
