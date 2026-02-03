/**
 * TagManager - Sistema genérico de etiquetas (Tags)
 * Permite adicionar, remover e recuperar tags para qualquer tipo de objeto
 */
export class TagManager<T> {
    private tags: Map<T, string[]>;

    constructor() {
        this.tags = new Map();
    }

    /**
     * Adiciona uma tag a um item
     * @param item - O item a qual adicionar a tag
     * @param tag - A tag a adicionar
     */
    addTag(item: T, tag: string): void {
        if (!this.tags.has(item)) {
            this.tags.set(item, []);
        }

        const itemTags = this.tags.get(item)!;
        if (!itemTags.includes(tag)) {
            itemTags.push(tag);
        }
    }

    /**
     * Remove uma tag de um item
     * @param item - O item do qual remover a tag
     * @param tag - A tag a remover
     */
    removeTag(item: T, tag: string): void {
        if (!this.tags.has(item)) {
            return;
        }

        const itemTags = this.tags.get(item)!;
        const index = itemTags.indexOf(tag);
        if (index > -1) {
            itemTags.splice(index, 1);
        }
    }

    /**
     * Retorna todas as tags de um item
     * @param item - O item do qual obter as tags
     * @returns Array de tags do item, ou array vazio se não existem tags
     */
    getTags(item: T): string[] {
        if (!this.tags.has(item)) {
            return [];
        }
        return [...this.tags.get(item)!];
    }

    /**
     * Remove todas as tags de um item
     * @param item - O item do qual remover todas as tags
     */
    clearTags(item: T): void {
        this.tags.delete(item);
    }

    /**
     * Verifica se um item tem uma tag específica
     * @param item - O item a verificar
     * @param tag - A tag a procurar
     * @returns true se o item tem a tag, false caso contrário
     */
    hasTag(item: T, tag: string): boolean {
        if (!this.tags.has(item)) {
            return false;
        }
        return this.tags.get(item)!.includes(tag);
    }

    /**
     * Retorna todos os itens com uma tag específica
     * @param tag - A tag a procurar
     * @returns Array de itens que têm a tag
     */
    getItemsWithTag(tag: string): T[] {
        const items: T[] = [];
        this.tags.forEach((tags, item) => {
            if (tags.includes(tag)) {
                items.push(item);
            }
        });
        return items;
    }
}
