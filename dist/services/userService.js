import { UserClass } from '../models/UserClass.js';
import { UserRole } from '../security/UserRole.js';
export let listUsers = [];
export let selectedUserId = null;
export const setSelectedUserId = (id) => { selectedUserId = id; };
/**
 * DADOS FAKE DE USUÁRIOS
 * Todos os usuários criados na inicialização da aplicação
 */
const fakeUsersData = [
    { id: 1, name: "Cynthia Bittow", email: "cynthia@gmail.com", active: true, role: UserRole.ADMIN },
    { id: 2, name: "Tais Dias", email: "tais.diasc@gmail.com", active: true, role: UserRole.MANAGER },
    { id: 3, name: "Daniel Moraes", email: "daniel.moraes@gmail.com", active: true, role: UserRole.ADMIN },
    { id: 4, name: "Natalia", email: "natalia@gmail.com", active: true, role: UserRole.VIEWER },
    { id: 5, name: "Debora", email: "debora@gmail.com", active: true, role: UserRole.USER },
    { id: 6, name: "Abel", email: "abel@gmail.com", active: false, role: UserRole.MEMBER },
    { id: 7, name: "Danilson", email: "danilson@gmail.com", active: true, role: UserRole.MEMBER },
    { id: 8, name: "Rebeca", email: "rebeca@gmail.com", active: true, role: UserRole.USER },
    { id: 9, name: "Gabriela", email: "gabriela@gmail.com", active: true, role: UserRole.MEMBER },
    { id: 10, name: "Gabriel", email: "gabriel@gmail.com", active: true, role: UserRole.MEMBER },
    { id: 11, name: "Tiago", email: "tiago@gmail.com", active: true, role: UserRole.USER },
    { id: 12, name: "Danilo", email: "danilo@gmail.com", active: true, role: UserRole.MEMBER },
    { id: 13, name: "Leonor", email: "leonor@gmail.com", active: true, role: UserRole.USER },
    { id: 14, name: "Sara", email: "sara@gmail.com", active: true, role: UserRole.MEMBER },
    { id: 15, name: "Antônio", email: "antonio@gmail.com", active: false, role: UserRole.MEMBER },
];
/**
 * Carrega dados iniciais de usuários
 */
export function loadInitialData(renderCallback) {
    listUsers.splice(0, listUsers.length);
    fakeUsersData.forEach(data => {
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
