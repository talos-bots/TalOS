import { Construct } from "@/classes/Construct";
import { saveNewConstruct } from "../dbapi";
import exifr from 'exifr'
// @ts-ignore
import extract from 'png-chunks-extract';
// @ts-ignore
import PNGtext from 'png-chunk-text';

export const importTavernCharacter = (
    file: File
): Promise<Construct> => {
    console.log("Importing Tavern Card");
    const reader = new FileReader();
    let base64Image: string = '';
    reader.onload = async (event) => {
        console.log("Reading Tavern Card");
        if (event.target && typeof event.target.result === 'string') {
            base64Image = event.target.result;
        }
    };
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
        console.log("Parsing Tavern Card");
        exifr.parse(file).then( async (metadata) => {
            console.log("Tavern Card Parsed");
            if (metadata) {
                const isCardV2 = metadata.chara;
                if (isCardV2) {
                    console.log("New Tavern Card Detected");
                    const decodedString = atob(metadata.chara);
                    const cardSpec = JSON.parse(decodedString);
                    let characterData;
                    if (cardSpec?.data !== undefined) {
                        characterData = cardSpec.data;
                    }else{
                        console.log("Old Tavern Card Detected");
                        characterData = cardSpec;
                    }
                    characterData.avatar = base64Image;
                    const construct = await processCharacterData(characterData);
                    resolve(construct);
                } else {
                    tryParseOldCard(file, base64Image).then((construct) => {
                        if (construct) {
                            resolve(construct);
                        } else {
                            reject();
                        }
                    });
                }
            }
        }).catch((error) => {
            console.log("Tavern Card Parse Failed", error);
            tryParseOldCard(file, base64Image).then((construct) => {
                console.log("Exif parser failure. Trying old parser");
                if (construct) {
                    resolve(construct);
                } else {
                    reject();
                }
            }).catch((error) => {
                console.log("Old Tavern Card Parse Failed", error);
                reject();
            });
        });
    });
};

async function processCharacterData(characterData: any): Promise<Construct> {
    console.log(characterData);
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
    return construct;
}
interface Chunk {
    name: string;
    data: any; // Replace 'any' with a more specific type if possible
}

const tryParseOldCard = (file: File, base64Image: string): Promise<Construct | void> => {
    console.log("Old Tavern Card Detected");
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (event) => {
            if (event.target && event.target.result instanceof ArrayBuffer) {
                const arrayBuffer = event.target.result;
                const uint8Array = new Uint8Array(arrayBuffer);
                const chunks: Chunk[] = extract(uint8Array);
                
                const textChunks = chunks.filter((chunk: Chunk) => chunk.name === 'tEXt').map((chunk: Chunk) => {
                    return PNGtext.decode(chunk.data);
                });
                
                if (textChunks.length > 0) {
                    const decodedString = decodeBase64(textChunks[0].text);
                    try {
                        let _json = JSON.parse(decodedString);
                        _json.avatar = base64Image;
                        console.log(_json);
                        const construct = await processCharacterData(_json);
                        resolve(construct);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        reject(error);
                    }
                } else {
                    reject();
                }
            }
        };
      
        reader.onerror = (error) => {
            console.error('Error reading file:', error);
            reject(error);
        };
      
        reader.readAsArrayBuffer(file);
    });
};

const decodeBase64 = (base64String: string) => {
    const text = atob(base64String);
    return decodeURIComponent(escape(text));
};