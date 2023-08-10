import fs from 'fs';
// @ts-ignore
import extract from 'png-chunks-extract';
// @ts-ignore
import PNGtext from 'png-chunk-text';
import { Agent } from '@/classes/Agent';
import { ipcMain } from 'electron';

export function BonusFeaturesRoutes() {

    ipcMain.on('import-tavern-character', async (event: any, img_url: any) => {
        const agent = await import_tavern_character(img_url);
        event.reply('import-tavern-character-reply', agent);
    });
}

async function import_tavern_character(img_url: any) {
    try {
        let format;
        if (img_url.indexOf('.webp') !== -1) {
            format = 'webp';
        } else {
            format = 'png';
        }

        let decoded_string: string = '';
        switch (format) {
            case 'png':
                const buffer = fs.readFileSync(img_url);
                const chunks = extract(buffer);

                const textChunks = chunks.filter(function (chunk: any) {
                    return chunk.name === 'tEXt';
                }).map(function (chunk: any) {
                    return PNGtext.decode(chunk.data);
                });
                decoded_string = Buffer.from(textChunks[0].text, 'base64').toString('utf8');
                break;
            default:
                return;
        }

        const _json = JSON.parse(decoded_string);
        
        // Determine the version based on the presence of the 'data' array
        const isV2 = Array.isArray(_json.data);

        let characterData;
        if (isV2) {
            characterData = {
                _id: Date.now().toString(),
                ..._json.data[0]  // assuming you want the first element from the data array
            };
        } else {
            characterData = {
                _id: Date.now().toString(),
                name: _json.name,
                description: _json.description,
                personality: _json.personality,
                scenario: _json.scenario,
                first_mes: _json.first_mes,
                mes_example: _json.mes_example
            };
        }

        const agent = new Agent();
        agent.name = characterData.name;
        agent.personality = characterData.personality + '\n' + characterData.description + '\n' + characterData.mes_example + '\n' + characterData.scenario;

        agent.addGreeting(characterData.first_mes);

        return agent;
    } catch (error) {
        console.error(error);
        throw error;
    }
}