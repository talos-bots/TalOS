import { ipcMain } from 'electron';
import Store from 'electron-store';
import { config, getJson } from "serpapi";

const store = new Store({
    name: 'langChainData',
});

let serpAPIKey = store.get('serpKey', '');
let azureKey = store.get('azureKey', '');

const setSerpKey = (key: string) => {
    store.set('serpKey', key);
    serpAPIKey = key;
}

const getSerpKey = () => {
    return store.get('serpKey');
}

const setAzureKey = (key: string) => {
    store.set('azureKey', key);
    azureKey = key;
}

const getAzureKey = () => {
    return store.get('azureKey');
}

export function LangChainRoutes(){
    ipcMain.on("set-serp-key", (_, arg) => {
        setSerpKey(arg);
    });

    ipcMain.on("set-azure-key", (_, arg) => {
        setAzureKey(arg);
    });

    ipcMain.on("get-serp-key", (event) => {
        event.sender.send('get-serp-key-reply', getSerpKey());
    });

    ipcMain.on("get-azure-key", (event) => {
        event.sender.send('get-azure-key-reply', getAzureKey());
    });
}