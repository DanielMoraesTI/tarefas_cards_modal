export class UserClass {
    id;
    name;
    email;
    active;
    createdAt;
    constructor(id, name, email, active = true, createdAt = new Date()) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = active;
        this.createdAt = createdAt;
    }
}
