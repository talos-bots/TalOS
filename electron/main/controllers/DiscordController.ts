import { ipcMain } from 'electron';
import Store from 'electron-store';
const store = new Store({
    name: 'discordData',
});

type DiscordMode = 'Character' | 'Construct';

const setDiscordMode = (mode: DiscordMode) => {
    store.set('mode', mode);
};

const getDiscordMode = (): DiscordMode => {
    return store.get('mode') as DiscordMode;
};

const clearDiscordMode = () => {
    store.set('mode', null);
};

function DiscordController(){
    ipcMain.on('discordMode', (event, arg) => {
        setDiscordMode(arg);
    });

    ipcMain.handle('getDiscordMode', () => {
        return getDiscordMode();
    });

    ipcMain.on('clearDiscordMode', () => {
        clearDiscordMode();
    });
}
export default DiscordController;