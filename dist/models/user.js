import { BaseEntity } from './BaseEntity.js';
export class UserClass extends BaseEntity {
    _name;
    _email;
    active;
    constructor(id, name, email, active = true) {
        super(id);
        this._name = name;
        this.validateEmail(email);
        this._email = email;
        this.active = active;
    }
    get name() { return this._name; }
    set name(value) {
        if (value.length < 2)
            throw new Error("Nome muito curto");
        this._name = value;
    }
    get email() { return this._email; }
    set email(value) {
        this.validateEmail(value);
        this._email = value;
    }
    validateEmail(email) {
        if (!email.includes("@")) {
            throw new Error("Email inválido: deve conter @");
        }
    }
}
