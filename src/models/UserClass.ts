import { BaseEntity } from './BaseEntity.js';
import { UserRole } from '../security/UserRole.js';

export class UserClass extends BaseEntity {
    private _name: string;
    private _email: string;
    private active: boolean;
    private role: UserRole;

    constructor(id: number, name: string, email: string, role: UserRole) {
        super(id);
        
        this.validateEmail(email);
        
        this._name = name;
        this._email = email;
        this.role = role;
        this.active = true;
    }

    // Getter para name: acessado como user.name
    public get name(): string {
        return this._name;
    }

    public isActive(): boolean {
        return this.active;
    }

    public toggleActive(): void {
        this.active = !this.active;
    }

    // Método: acessado como user.getRole()
    public getRole(): UserRole {
        return this.role;
    }

    // Método: acessado como user.getEmail()
    public getEmail(): string {
        return this._email;
    }

    private validateEmail(email: string): void {
        if (!email.includes("@")) {
            throw new Error("Formato de email inválido.");
        }
    }
}




