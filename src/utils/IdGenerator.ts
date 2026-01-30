/**
 * Gerador Global de IDs Únicos.
 * Esta classe utiliza o padrão Static para garantir um contador centralizado
 * que persiste durante todo o ciclo de vida da aplicação na memória.
 */
export class IdGenerator {
    // 1. Contador interno privado e estático: inacessível fora desta classe
    private static counter: number = 0;

    // 2. Bloqueio de instâncias: O TypeScript impede o uso de 'new IdGenerator()'
    // se definirmos um constructor privado.
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