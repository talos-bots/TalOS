import { ipcMain } from 'electron';
import Store from 'electron-store';
const store = new Store({
    name: 'discordData',
});
type DiscordMode = 'Character' | 'Construct';

const setDiscordMode = (mode: DiscordMode) => {
    store.set('mode', mode);
};

function DiscordController(){

    ipcMain.on('discordMode', (event, arg) => {
        setDiscordMode(arg);
    });
}
export default DiscordController;