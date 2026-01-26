import { workCategoria, subjectCategoria } from '../utils/utilTypes.js';

export interface Task {
    id: number;
    userId: number;
    title: string;
    completed: boolean;
    category: workCategoria;
    subject: subjectCategoria;
    concludedAt?: Date;
}





