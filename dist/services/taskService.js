export let listTasks = [];
export const setListTasks = (newList) => {
    listTasks = newList;
};
export function removeTasksByUserId(userId) {
    setListTasks(listTasks.filter(t => t.userId !== userId));
}
