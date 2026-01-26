// src/models/user.ts
export class UserClass {
    id;
    name;
    email;
    active;
    createdAt;
    // Ao adicionar 'public' antes de createdAt no constructor, 
    // o TS cria e atribui a propriedade automaticamente.
    constructor(id, name, email, active = true, createdAt = new Date() // Valor padrão é a data atual
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = active;
        this.createdAt = createdAt;
    }
}
