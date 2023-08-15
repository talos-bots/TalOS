import { Construct } from "@/classes/Construct";
import { ipcRenderer } from "electron";
import { saveNewConstruct } from "../dbapi";

export const importTavernCharacter = (
    file: File
): Promise<Construct> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const fileContents = reader.result;
            const uniqueEventName = "get-tavern-card-reply-" + Date.now() + "-" + Math.random();
            ipcRenderer.send('import-tavern-character', {
                name: file.name,
                contents: fileContents
            }, uniqueEventName);

            ipcRenderer.once(uniqueEventName, async (event, characterData) => {
                if (characterData) {
                    const construct = new Construct();
                    construct.avatar = characterData.avatar;
                    construct.name = (characterData.name || '').replaceAll('\r', '');
                    construct.background = (characterData.scenario || '').replaceAll('\r', '');

                    // Construct personality field by filtering out empty or null parts
                    const personalityParts = [
                        characterData.personality,
                        characterData.mes_example,
                        characterData.description
                    ].filter(part => part && part.trim().length > 0);
                    construct.personality = personalityParts.join('\n').replaceAll('\r', '');

                    if (characterData.first_mes && characterData.first_mes.trim().length > 0) {
                        construct.addGreeting(characterData.first_mes.replaceAll('\r', ''));
                    }

                    await saveNewConstruct(construct);
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
