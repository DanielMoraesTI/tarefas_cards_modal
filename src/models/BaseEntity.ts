export class BaseEntity {
    protected id: number;
    protected createdAt: Date;

    constructor(id: number) {
        this.id = id;
        this.createdAt = new Date();
    }

    public get getId(): number {
        return this.id;
    }

    public get getCreatedAt(): Date {
        return this.createdAt;
    }
}