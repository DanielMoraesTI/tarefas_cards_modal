/**
 * Gerador Global de IDs Únicos.
 * Esta classe utiliza o padrão Static para garantir um contador centralizado
 * que persiste durante todo o ciclo de vida da aplicação na memória.
 */
export class IdGenerator {
    private static counter: number = 0;

    private constructor() {}

    /**
     * Gera um novo ID único incrementando o contador global.
     * @returns {number} O próximo ID disponível.
     */
    public static generate(): number {
        IdGenerator.counter++;
        return IdGenerator.counter;
    }
}