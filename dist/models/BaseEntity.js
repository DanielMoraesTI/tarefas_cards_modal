export class BaseEntity {
    id;
    createdAt;
    constructor(id) {
        this.id = id;
        this.createdAt = new Date();
    }
    get getId() {
        return this.id;
    }
    get getCreatedAt() {
        return this.createdAt;
    }
}
