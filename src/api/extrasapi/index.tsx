import { Construct } from "@/classes/Construct";
import { ipcRenderer } from "electron";

export const importTavernCharacter = (
    file: File
): Promise<Construct> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const fileContents = reader.result;

            ipcRenderer.send('import-tavern-character', {
                name: file.name,
                contents: fileContents
            });

            ipcRenderer.once('import-tavern-character-reply', (event, characterData) => {
                if (characterData) {
                    const construct = new Construct();
                    construct.avatar = characterData.avatar;
                    construct.name = (characterData.name).replaceAll('\r', '');
                    construct.background = (characterData.scenario).replaceAll('\r', '');
                    construct.personality = (characterData.personality + '\n' + characterData.mes_example + '\n' + characterData.description).replaceAll('\r', '');
                    construct.addGreeting((characterData.first_mes).replaceAll('\r', ''));
                    resolve(construct);
                } else {
                    reject(new Error("No data received from 'import-tavern-character' event."));
                }
            });
        };

        reader.onerror = () => {
            reject(new Error("Error reading file"));
        };

        reader.readAsDataURL(file);
    });
}
