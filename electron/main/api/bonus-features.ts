import fs from 'fs';
// @ts-ignore
import extract from 'png-chunks-extract';
// @ts-ignore
import PNGtext from 'png-chunk-text';
import { ipcMain } from 'electron';

export function BonusFeaturesRoutes() {
    ipcMain.on('import-tavern-character', async (event: any, fileData: any) => {
        const agent = await import_tavern_character(fileData);
        event.reply('import-tavern-character-reply', agent);
    });
}

async function import_tavern_character(fileData: { contents: string, name: string }) {
    try {
        let format;
        if (fileData.name.indexOf('.webp') !== -1) {
            format = 'webp';
        } else {
            format = 'png';
        }

        let decoded_string: string = '';
        switch (format) {
            case 'png':
                // Decode the Base64 string to get the file content as a Buffer
                const buffer = Buffer.from(fileData.contents.split(',')[1], 'base64');
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
                ..._json.data[0]
            };
        } else {
            characterData = {
                _id: Date.now().toString(),
                name: _json.name,
                description: _json.description,
                personality: _json.personality,
                scenario: _json.scenario,
                first_mes: _json.first_mes,
                mes_example: _json.mes_example,
                avatar: fileData.contents
            };
        }

        // Include the Base64 image data in the object you are returning
        return characterData;

    } catch (error) {
        console.error(error);
        throw error;
    }
}