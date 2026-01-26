export interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;
    createdAt: Date;
}

export class UserClass implements User {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public active: boolean = true,
        public createdAt: Date = new Date()
    ) {}
}





