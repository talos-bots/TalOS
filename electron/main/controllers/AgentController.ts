import { ipcMain } from 'electron';
import Store from 'electron-store';
const store = new Store();
type AgentID = string;

export let ActiveAgents: AgentID[] = [];

export const retrieveAgents = (): AgentID[] => {
    return store.get('ids', []) as AgentID[];
}

export const addAgent = (newId: AgentID): void => {
    const existingIds = retrieveAgents();
    if (!existingIds.includes(newId)) {
        existingIds.push(newId);
        store.set('ids', existingIds);
    }
}

export const removeAgent = (idToRemove: AgentID): void => {
    const existingIds = retrieveAgents();
    const updatedIds = existingIds.filter(id => id !== idToRemove);
    store.set('ids', updatedIds);
}

export const isAgentActive = (id: AgentID): boolean => {
    const existingIds = retrieveAgents();
    return existingIds.includes(id);
}

function agentController() {
    ActiveAgents = retrieveAgents();
    
    ipcMain.on('add-agent', (event, arg) => {
        addAgent(arg);
        ActiveAgents = retrieveAgents();
        event.reply('add-agent-reply', ActiveAgents);
    });
    
    ipcMain.on('remove-agent', (event, arg) => {
        removeAgent(arg);
        ActiveAgents = retrieveAgents();
        event.reply('remove-agent-reply', ActiveAgents);
    });
    
    ipcMain.on('get-agents', (event, arg) => {
        ActiveAgents = retrieveAgents();
        event.reply('get-agents-reply', ActiveAgents);
    });

    ipcMain.on('is-agent-active', (event, arg) => {
        const isActive = isAgentActive(arg);
        event.reply('is-agent-active-reply', isActive);
    });
}
export default agentController;