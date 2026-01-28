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
    listUsers.length = 0;
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
    const user = listUsers.find(u => u.id === id || u.getId === id);
    if (user) {
        user.toggleActive();
    }
}
export function removeUserLogic(id) {
    listUsers = listUsers.filter(u => u.id !== id && u.getId !== id);
}
