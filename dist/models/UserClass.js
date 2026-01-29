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
    get name() {
        return this._name;
    }
    get getId() {
        return this.id;
    }
    isActive() {
        return this.active;
    }
    setActive(status) {
        this.active = status;
    }
    toggleActive() {
        this.active = !this.active;
    }
    getRole() {
        return this.role;
    }
    getEmail() {
        return this._email;
    }
    validateEmail(email) {
        if (!email.includes("@")) {
            throw new Error("Formato de email inválido.");
        }
    }
}
