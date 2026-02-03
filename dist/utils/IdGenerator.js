/**
 * Gerador Global de IDs Únicos.
 * Esta classe utiliza o padrão Static para garantir um contador centralizado
 * que persiste durante todo o ciclo de vida da aplicação na memória.
 */
export class IdGenerator {
    static counter = 0;
    constructor() { }
    /**
     * Gera um novo ID único incrementando o contador global.
     * @returns {number} O próximo ID disponível.
     */
    static generate() {
        IdGenerator.counter++;
        return IdGenerator.counter;
    }
}
