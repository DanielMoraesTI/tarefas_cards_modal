// src/models/user.ts

export interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;
    createdAt: Date; // Adicionado à interface
}

export class UserClass implements User {
    // Ao adicionar 'public' antes de createdAt no constructor, 
    // o TS cria e atribui a propriedade automaticamente.
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public active: boolean = true,
        public createdAt: Date = new Date() // Valor padrão é a data atual
    ) {}
}





