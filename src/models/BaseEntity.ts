import { IdGenerator } from '../utils/IdGenerator.js';

export class BaseEntity {
    /** * Alterado para 'public'. 
     * Necessário para satisfazer a interface ITask e permitir acesso direto
     * em serviços como PriorityService e AssignmentService (ex: b1.id).
     */
    public id: number; 
    protected createdAt: Date;

    private static totalEntities: number = 0;

    /**
     * @param id - Opcional. Se fornecido, utiliza este ID. 
     * Se omitido, gera um ID único automaticamente via IdGenerator.
     */
    constructor(id?: number) {
        // Se o id for fornecido (ex: num restauro de dados), usa esse.
        // Caso contrário, pede um novo ID ao nosso gerador estático.
        this.id = id ?? IdGenerator.generate();
        
        this.createdAt = new Date();

        // Mantemos o teu contador global de instâncias ativo
        BaseEntity.totalEntities++;
    }

    public static getTotalEntities(): number {
        return BaseEntity.totalEntities;
    }

    /**
     * Mantemos o getter para compatibilidade com o código que já usa .getId
     */
    public get getId(): number {
        return this.id;
    }

    public get getCreatedAt(): Date {
        return this.createdAt;
    }
}