import { Construct } from "@/classes/Construct";
import { ipcRenderer } from "electron";

export const importTavernCharacter = (
    imgUrl: string
): Promise<Construct> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('import-tavern-character', imgUrl);

        ipcRenderer.once('import-tavern-character-reply', (event, characterData) => {
            if (characterData) {
                const construct = new Construct();
                construct.name = characterData.name;
                construct.personality = characterData.personality + '\n' + characterData.description + '\n' + characterData.mes_example + '\n' + characterData.scenario;

                construct.addGreeting(characterData.first_mes);
                resolve(construct);
            } else {
                reject(new Error("No data received from 'import-tavern-character' event."));
            }
        });
    });
}
