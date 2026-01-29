import { UserClass } from '../models/UserClass.js';
import { UserRole } from '../security/UserRole.js';
export let listUsers = [];
export let selectedUserId = null;
export const setSelectedUserId = (id) => { selectedUserId = id; };
export function loadInitialData(renderCallback) {
    const fakeData = [
        { id: 1, name: "Cynthia Bittow", email: "cynthia@gmail.com", active: true, role: UserRole.ADMIN },
        { id: 2, name: "Tais Dias", email: "tais.diasc@gmail.com", active: false, role: UserRole.MANAGER },
        { id: 3, name: "Daniel Moraes", email: "daniel.moraes@gmail.com", active: true, role: UserRole.ADMIN },
        { id: 4, name: "Natalia", email: "natalia@gmail.com", active: true, role: UserRole.VIEWER },
        { id: 5, name: "Debora", email: "debora@gmail.com", active: true, role: UserRole.USER },
    ];
    // Limpa a lista mantendo a mesma referência de memória
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
export function toggleUserStatus(id) {
    const user = listUsers.find(u => u.getId === id);
    if (user) {
        user.toggleActive();
    }
}
export function removeUserLogic(id) {
    const index = listUsers.findIndex(u => u.getId === id);
    if (index !== -1) {
        listUsers.splice(index, 1);
    }
}
