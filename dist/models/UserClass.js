import { BaseEntity } from './BaseEntity.js';
export class UserClass extends BaseEntity {
    _name;
    _email;
    active;
    role;
    constructor(id, name, email, role) {
        super(id);
        this.validateEmail(email);
        this._name = name;
        this._email = email;
        this.role = role;
        this.active = true;
    }
    // Getter para name: acessado como user.name
    get name() {
        return this._name;
    }
    isActive() {
        return this.active;
    }
    toggleActive() {
        this.active = !this.active;
    }
    // Método: acessado como user.getRole()
    getRole() {
        return this.role;
    }
    // Método: acessado como user.getEmail()
    getEmail() {
        return this._email;
    }
    validateEmail(email) {
        if (!email.includes("@")) {
            throw new Error("Formato de email inválido.");
        }
    }
}
