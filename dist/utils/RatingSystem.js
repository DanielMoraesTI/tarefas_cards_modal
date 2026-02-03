/**
 * RatingSystem - Sistema genérico de avaliações (ratings)
 * Permite avaliar qualquer tipo de entidade (tarefas, utilizadores, etc.)
 * Escala: 1 a 5 (ou personalizada)
 */
export class RatingSystem {
    ratings;
    constructor() {
        this.ratings = new Map();
    }
    /**
     * Adiciona uma avaliação a um item
     * @param item - O item a avaliar
     * @param value - Valor da avaliação (recomendado 1-5)
     * @throws Erro se valor for inválido
     */
    rate(item, value) {
        if (value < 1 || value > 5) {
            throw new Error("Avaliação deve estar entre 1 e 5");
        }
        if (!this.ratings.has(item)) {
            this.ratings.set(item, []);
        }
        this.ratings.get(item).push(value);
    }
    /**
     * Calcula a média de avaliações de um item
     * @param item - O item
     * @returns Média das avaliações (arredondada a 2 casas decimais), ou 0 se sem avaliações
     */
    getAverage(item) {
        if (!this.ratings.has(item) || this.ratings.get(item).length === 0) {
            return 0;
        }
        const itemRatings = this.ratings.get(item);
        const sum = itemRatings.reduce((a, b) => a + b, 0);
        const average = sum / itemRatings.length;
        return Math.round(average * 100) / 100;
    }
    /**
     * Retorna todas as avaliações de um item
     * @param item - O item
     * @returns Array de avaliações, ou array vazio se nenhuma
     */
    getRatings(item) {
        if (!this.ratings.has(item)) {
            return [];
        }
        return [...this.ratings.get(item)];
    }
    /**
     * Retorna o número de avaliações de um item
     * @param item - O item
     * @returns Número de avaliações
     */
    getCount(item) {
        if (!this.ratings.has(item)) {
            return 0;
        }
        return this.ratings.get(item).length;
    }
    /**
     * Obtém a avaliação mais alta de um item
     * @param item - O item
     * @returns Avaliação máxima, ou 0 se sem avaliações
     */
    getMaxRating(item) {
        if (!this.ratings.has(item) || this.ratings.get(item).length === 0) {
            return 0;
        }
        return Math.max(...this.ratings.get(item));
    }
    /**
     * Obtém a avaliação mais baixa de um item
     * @param item - O item
     * @returns Avaliação mínima, ou 0 se sem avaliações
     */
    getMinRating(item) {
        if (!this.ratings.has(item) || this.ratings.get(item).length === 0) {
            return 0;
        }
        return Math.min(...this.ratings.get(item));
    }
    /**
     * Retorna distribuição de avaliações (contagem por estrela)
     * @param item - O item
     * @returns Objeto com contagem de cada nível de avaliação
     */
    getDistribution(item) {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        if (!this.ratings.has(item)) {
            return distribution;
        }
        this.ratings.get(item).forEach(rating => {
            distribution[rating]++;
        });
        return distribution;
    }
    /**
     * Verifica se um item foi avaliado
     * @param item - O item
     * @returns true se tem avaliações, false caso contrário
     */
    hasRatings(item) {
        return this.ratings.has(item) && this.ratings.get(item).length > 0;
    }
    /**
     * Remove todas as avaliações de um item
     * @param item - O item
     */
    clearRatings(item) {
        this.ratings.delete(item);
    }
    /**
     * Remove a última avaliação de um item
     * @param item - O item
     */
    removeLastRating(item) {
        if (this.ratings.has(item) && this.ratings.get(item).length > 0) {
            this.ratings.get(item).pop();
        }
    }
    /**
     * Retorna todos os ratings
     * @returns Map com todos os items e suas avaliações
     */
    getAll() {
        return new Map(this.ratings);
    }
    /**
     * Ordena items por média de avaliação (decrescente)
     * @returns Array de items ordenado por média de rating
     */
    sortByAverage() {
        return Array.from(this.ratings.keys())
            .sort((a, b) => this.getAverage(b) - this.getAverage(a));
    }
    /**
     * Retorna items com média de avaliação acima de um limiar
     * @param threshold - Valor mínimo de média
     * @returns Array de items com média >= threshold
     */
    getByMinAverage(threshold) {
        return Array.from(this.ratings.keys())
            .filter(item => this.getAverage(item) >= threshold);
    }
    /**
     * Calcula estatísticas gerais de ratings
     * @returns Objeto com estatísticas
     */
    getGeneralStats() {
        if (this.ratings.size === 0) {
            return {
                totalRatings: 0,
                itemsRated: 0,
                averageRating: 0,
                highestAverage: 0,
                lowestAverage: 0
            };
        }
        let totalRatings = 0;
        let totalSum = 0;
        let highestAverage = 0;
        let lowestAverage = 5;
        this.ratings.forEach(ratings => {
            totalRatings += ratings.length;
            const sum = ratings.reduce((a, b) => a + b, 0);
            totalSum += sum;
            const average = sum / ratings.length;
            highestAverage = Math.max(highestAverage, average);
            lowestAverage = Math.min(lowestAverage, average);
        });
        return {
            totalRatings,
            itemsRated: this.ratings.size,
            averageRating: Math.round((totalSum / totalRatings) * 100) / 100,
            highestAverage: Math.round(highestAverage * 100) / 100,
            lowestAverage: Math.round(lowestAverage * 100) / 100
        };
    }
}
