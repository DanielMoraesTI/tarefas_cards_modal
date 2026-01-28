import { UserRole } from './UserRole.js';

export function canCreateTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}

export function canEditTask(role: UserRole): boolean {
    return role !== UserRole.VIEWER;
}

export function canDeleteTask(role: UserRole): boolean {
    return role === UserRole.ADMIN;
}

export function canAssignTask(role: UserRole): boolean {
    return role === UserRole.ADMIN || role === UserRole.MANAGER;
}