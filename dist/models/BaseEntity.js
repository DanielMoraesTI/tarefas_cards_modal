import { IdGenerator } from '../utils/IdGenerator.js';
export class BaseEntity {
    /** * Alterado para 'public'.
     * Necessário para satisfazer a interface ITask e permitir acesso direto
     * em serviços como PriorityService e AssignmentService (ex: b1.id).
     */
    id;
    createdAt;
    static totalEntities = 0;
    /**
     * @param id - Opcional. Se fornecido, utiliza este ID.
     * Se omitido, gera um ID único automaticamente via IdGenerator.
     */
    constructor(id) {
        this.id = id ?? IdGenerator.generate();
        this.createdAt = new Date();
        BaseEntity.totalEntities++;
    }
    static getTotalEntities() {
        return BaseEntity.totalEntities;
    }
    get getId() {
        return this.id;
    }
    get getCreatedAt() {
        return this.createdAt;
    }
}
