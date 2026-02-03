/**
 * PAGINATOR - Paginador Genérico
 * 
 * Permite paginar listas grandes de qualquer tipo (genérico <T>).
 * Útil para dividir resultados em múltiplas páginas.
 * 
 * Casos de uso:
 * - Paginação de usuários
 * - Paginação de tarefas
 * - Paginação de comentários
 * - Qualquer lista que precisa ser dividida em páginas
 */

export class Paginator<T> {
    
    /**
     * Pagina um array de items
     * 
     * @param items - Array completo de items
     * @param page - Número da página (começa em 1)
     * @param size - Quantidade de items por página
     * @returns Array com os items da página solicitada
     * 
     * @example
     * const paginator = new Paginator<User>();
     * const page1 = paginator.paginate(users, 1, 10); // Primeiros 10 items
     * const page2 = paginator.paginate(users, 2, 10); // Próximos 10 items
     */
    paginate(items: T[], page: number, size: number): T[] {
        // Validar entrada
        if (page < 1) {
            console.warn("Página deve ser >= 1, usando página 1");
            page = 1;
        }
        
        if (size < 1) {
            console.warn("Tamanho deve ser >= 1, usando tamanho 1");
            size = 1;
        }
        
        // Calcular índices
        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        
        // Usar slice para extrair a página
        return items.slice(startIndex, endIndex);
    }

    /**
     * Calcula o número total de páginas
     * 
     * @param totalItems - Quantidade total de items
     * @param size - Quantidade de items por página
     * @returns Número total de páginas
     */
    getTotalPages(totalItems: number, size: number): number {
        if (size < 1) return 0;
        return Math.ceil(totalItems / size);
    }

    /**
     * Verifica se a página solicitada é válida
     * 
     * @param page - Número da página
     * @param totalItems - Quantidade total de items
     * @param size - Quantidade de items por página
     * @returns true se a página é válida, false caso contrário
     */
    isValidPage(page: number, totalItems: number, size: number): boolean {
        const totalPages = this.getTotalPages(totalItems, size);
        return page >= 1 && page <= totalPages;
    }

    /**
     * Obtém informações sobre uma página
     * 
     * @param items - Array completo de items
     * @param page - Número da página
     * @param size - Quantidade de items por página
     * @returns Objeto com informações de paginação
     */
    getPageInfo(items: T[], page: number, size: number): {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startIndex: number;
        endIndex: number;
        items: T[];
    } {
        const totalItems = items.length;
        const totalPages = this.getTotalPages(totalItems, size);
        const startIndex = Math.max(0, (page - 1) * size);
        const endIndex = Math.min(totalItems, startIndex + size);
        const pageItems = items.slice(startIndex, endIndex);

        return {
            currentPage: page,
            pageSize: size,
            totalItems: totalItems,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            startIndex: startIndex,
            endIndex: endIndex,
            items: pageItems
        };
    }

    /**
     * Pagina e retorna com informações extras
     * 
     * @param items - Array completo de items
     * @param page - Número da página
     * @param size - Quantidade de items por página
     * @returns Objeto com items e metadados de paginação
     */
    paginateWithInfo(items: T[], page: number, size: number): {
        items: T[];
        page: number;
        size: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    } {
        const info = this.getPageInfo(items, page, size);
        
        return {
            items: info.items,
            page: info.currentPage,
            size: info.pageSize,
            total: info.totalItems,
            pages: info.totalPages,
            hasNext: info.hasNextPage,
            hasPrev: info.hasPreviousPage
        };
    }

    /**
     * Obtém todas as páginas como um array
     * 
     * @param items - Array completo de items
     * @param size - Quantidade de items por página
     * @returns Array com todas as páginas (cada página é um array de items)
     */
    getAllPages(items: T[], size: number): T[][] {
        const totalPages = this.getTotalPages(items.length, size);
        const pages: T[][] = [];

        for (let page = 1; page <= totalPages; page++) {
            pages.push(this.paginate(items, page, size));
        }

        return pages;
    }

    /**
     * Procura um item e retorna informações sobre em qual página ele está
     * 
     * @param items - Array completo de items
     * @param predicate - Função que retorna true para o item procurado
     * @param size - Quantidade de items por página
     * @returns Objeto com página, índice e item, ou null se não encontrado
     */
    findItemPage(items: T[], predicate: (item: T) => boolean, size: number): {
        page: number;
        indexInPage: number;
        indexInArray: number;
        item: T;
    } | null {
        const itemIndex = items.findIndex(predicate);
        
        if (itemIndex === -1) {
            return null;
        }

        const page = Math.floor(itemIndex / size) + 1;
        const indexInPage = itemIndex % size;

        return {
            page: page,
            indexInPage: indexInPage,
            indexInArray: itemIndex,
            item: items[itemIndex]
        };
    }
}

export default Paginator;
