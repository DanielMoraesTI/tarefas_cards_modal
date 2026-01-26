import { Task } from '../models/task.js';

export let listTasks: Task[] = [];

export const setListTasks = (newList: Task[]) => {
    listTasks = newList;
};

export function removeTasksByUserId(userId: number): void {
    setListTasks(listTasks.filter(t => t.userId !== userId));
}


