import { ipcMain } from 'electron';
import Store from 'electron-store';
const store = new Store();
type ConstructID = string;

export let ActiveConstructs: ConstructID[] = [];

export const retrieveConstructs = (): ConstructID[] => {
    return store.get('ids', []) as ConstructID[];
}

export const addConstruct = (newId: ConstructID): void => {
    const existingIds = retrieveConstructs();
    if (!existingIds.includes(newId)) {
        existingIds.push(newId);
        store.set('ids', existingIds);
    }
}

export const removeConstruct = (idToRemove: ConstructID): void => {
    const existingIds = retrieveConstructs();
    const updatedIds = existingIds.filter(id => id !== idToRemove);
    store.set('ids', updatedIds);
}

export const isConstructActive = (id: ConstructID): boolean => {
    const existingIds = retrieveConstructs();
    return existingIds.includes(id);
}

function constructController() {
    ActiveConstructs = retrieveConstructs();
    
    ipcMain.on('add-construct', (event, arg) => {
        addConstruct(arg);
        ActiveConstructs = retrieveConstructs();
        event.reply('add-construct-reply', ActiveConstructs);
    });
    
    ipcMain.on('remove-construct', (event, arg) => {
        removeConstruct(arg);
        ActiveConstructs = retrieveConstructs();
        event.reply('remove-construct-reply', ActiveConstructs);
    });
    
    ipcMain.on('get-constructs', (event, arg) => {
        ActiveConstructs = retrieveConstructs();
        event.reply('get-constructs-reply', ActiveConstructs);
    });

    ipcMain.on('is-construct-active', (event, arg) => {
        const isActive = isConstructActive(arg);
        event.reply('is-construct-active-reply', isActive);
    });
}
export default constructController;