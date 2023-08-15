import { ipcMain } from 'electron';
import Store from 'electron-store';
const store = new Store({
    name: 'constructData',
});
type ConstructID = string;

export let ActiveConstructs: ConstructID[] = [];

const retrieveConstructs = (): ConstructID[] => {
    return store.get('ids', []) as ConstructID[];
}

const addConstruct = (newId: ConstructID): void => {
    const existingIds = retrieveConstructs();
    if (!existingIds.includes(newId)) {
        existingIds.push(newId);
        store.set('ids', existingIds);
    }
}

const removeConstruct = (idToRemove: ConstructID): void => {
    const existingIds = retrieveConstructs();
    const updatedIds = existingIds.filter(id => id !== idToRemove);
    store.set('ids', updatedIds);
}

const isConstructActive = (id: ConstructID): boolean => {
    const existingIds = retrieveConstructs();
    return existingIds.includes(id);
}

const clearActiveConstructs = (): void => {
    store.set('ids', []);
}

const setAsPrimary = (id: ConstructID): void => {
    const existingIds = retrieveConstructs();  // Assuming retrieveConstructs returns an array of ConstructID
    const index = existingIds.indexOf(id);
    
    if (index > -1) {
        existingIds.splice(index, 1);
    }

    existingIds.unshift(id);

    store.set('ids', existingIds); 
}

function constructController() {
    ActiveConstructs = retrieveConstructs();
    
    ipcMain.on('add-construct-to-active', (event, arg) => {
        addConstruct(arg);
        ActiveConstructs = retrieveConstructs();
        event.reply('add-construct-to-active-reply', ActiveConstructs);
    });
    
    ipcMain.on('remove-construct-active', (event, arg) => {
        removeConstruct(arg);
        ActiveConstructs = retrieveConstructs();
        event.reply('remove-construct-active-reply', ActiveConstructs);
    });
    
    ipcMain.on('get-construct-active-list', (event, arg) => {
        ActiveConstructs = retrieveConstructs();
        event.reply('get-construct-active-list-reply', ActiveConstructs);
    });

    ipcMain.on('is-construct-active', (event, arg) => {
        const isActive = isConstructActive(arg);
        event.reply('is-construct-active-reply', isActive);
    });

    ipcMain.on('remove-all-constructs-active', (event, arg) => {
        clearActiveConstructs();
        ActiveConstructs = retrieveConstructs();
        event.reply('remove-all-constructs-active-reply', ActiveConstructs);
    });

    ipcMain.on('set-construct-primary', (event, arg) => {
        setAsPrimary(arg);
        ActiveConstructs = retrieveConstructs();
        event.reply('set-construct-primary-reply', ActiveConstructs);
    });
}
export default constructController;