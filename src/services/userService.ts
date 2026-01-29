import { UserClass } from '../models/UserClass.js';
import { UserRole } from '../security/UserRole.js'; 

export let listUsers: UserClass[] = [];
export let selectedUserId: number | null = null;

export const setSelectedUserId = (id: number | null) => { selectedUserId = id; };

export function loadInitialData(renderCallback: () => void): void {
    const fakeData = [
        { id: 1, name: "Cynthia Bittow", email: "cynthia@gmail.com", active: true, role: UserRole.ADMIN },
        { id: 2, name: "Tais Dias", email: "tais.diasc@gmail.com", active: false, role: UserRole.MANAGER },
        { id: 3, name: "Daniel Moraes", email: "daniel.moraes@gmail.com", active: true, role: UserRole.ADMIN },
        { id: 4, name: "Natalia", email: "natalia@gmail.com", active: true, role: UserRole.VIEWER },
        { id: 5, name: "Debora", email: "debora@gmail.com", active: true, role: UserRole.USER },
    ];

    listUsers.splice(0, listUsers.length); 
    
    fakeData.forEach(data => {
        const newUser = new UserClass(data.id, data.name, data.email, data.role);
        
        if (!data.active) {
            newUser.toggleActive();
        }
        
        listUsers.push(newUser);
    });

    renderCallback();
}

export function toggleUserStatus(id: number): void {
    const user = listUsers.find(u => u.getId === id);
    if (user) {
        user.toggleActive();
    }
}

export function removeUserLogic(id: number): void {
    const index = listUsers.findIndex(u => u.getId === id);
    if (index !== -1) {
        listUsers.splice(index, 1);
    }
}







