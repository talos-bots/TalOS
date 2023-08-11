import { Agent } from "@/classes/Agent";
import { ipcRenderer } from "electron";

export const importTavernCharacter = (
    imgUrl: string
): Promise<Agent> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('import-tavern-character', imgUrl);

        ipcRenderer.once('import-tavern-character-reply', (event, characterData) => {
            if (characterData) {
                const agent = new Agent();
                agent.name = characterData.name;
                agent.personality = characterData.personality + '\n' + characterData.description + '\n' + characterData.mes_example + '\n' + characterData.scenario;

                agent.addGreeting(characterData.first_mes);
                resolve(agent);
            } else {
                reject(new Error("No data received from 'import-tavern-character' event."));
            }
        });
    });
}
