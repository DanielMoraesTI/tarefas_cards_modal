import { UserRole } from './UserRole.js';
export function canCreateTask(role) {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}
export function canEditTask(role) {
    return role !== UserRole.VIEWER;
}
export function canDeleteTask(role) {
    return role === UserRole.ADMIN;
}
export function canAssignTask(role) {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}
