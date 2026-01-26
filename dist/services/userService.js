import { UserClass } from '../models/user.js';
export let listUsers = [];
export let selectedUserId = null;
export const setSelectedUserId = (id) => { selectedUserId = id; };
export function loadInitialData(renderCallback) {
    const fakeData = [
        { id: 1, name: "Cynhtia", email: "cynthia@gmail.com", active: true },
        { id: 2, name: "Tais Dias", email: "tais.diasc@gmail.com", active: false },
        { id: 3, name: "Daniel Moraes", email: "daniel.moraesa@gmail.com", active: true },
        { id: 4, name: "Natalia", email: "natalia@gmail.com", active: true },
        { id: 5, name: "Debora", email: "debora@gmail.com", active: true },
    ];
    // Limpa a lista antes de adicionar para evitar duplicatas em hot-reload
    listUsers.length = 0;
    fakeData.forEach(data => {
        listUsers.push(new UserClass(data.id, data.name, data.email, data.active));
    });
    renderCallback(); // Aqui ele desenha na tela
}
export function toggleUserStatus(id) {
    const user = listUsers.find(u => u.id === id);
    if (user)
        user.active = !user.active;
}
export function removeUserLogic(id) {
    listUsers = listUsers.filter(u => u.id !== id);
}
