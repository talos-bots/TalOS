import { Construct } from "@/classes/Construct";
import { saveNewConstruct } from "../dbapi";
import exifr from 'exifr'
// @ts-ignore
import extract from 'png-chunks-extract';
// @ts-ignore
import PNGtext from 'png-chunk-text';
// @ts-ignore
import { encode } from 'png-chunk-text';
// @ts-ignore
import encodePng from 'png-chunks-encode';
import { TavernCardV2 } from "@/types";
import { ipcRenderer } from "electron";
import { uploadImage } from "../baseapi";

export const importTavernCharacter = (file: File): Promise<Construct> => {
    return new Promise((resolve, reject) => {
        console.log("Parsing Tavern Card");

        exifr.parse(file).then(async (metadata) => {
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
                    } else {
                        console.log("Old Tavern Card Detected");
                        characterData = cardSpec;
                    }
                    const newName = Date.now().toString() + '.' + file.name.split('.').pop();
                    const formData = new FormData();
                    formData.append('image', file, newName);
                    uploadImage(formData);
                    // Here, instead of appending the base64, you append the new filename
                    const newPath = '/api/images/' + newName;
                    characterData.avatar = newPath;
                    console.log("New Filename", newPath);
                    console.log(characterData);
                    const construct = await processCharacterData(characterData, newPath);
                    resolve(construct);
                } else {
                    const newName = Date.now().toString() + '.' + file.name.split('.').pop();
                    const formData = new FormData();
                    formData.append('image', file, newName);
                    uploadImage(formData);
                    const newPath = '/api/images/' + newName;
                    tryParseOldCard(file, newPath).then((construct) => {
                        if (construct) {
                            resolve(construct);
                        } else {
                            reject(new Error("Failed to parse old card"));
                        }
                    });
                }
            }
        }).catch((error) => {
            console.log("Tavern Card Parse Failed", error);
            const newName = Date.now().toString() + '.' + file.name.split('.').pop();
            const formData = new FormData();
            formData.append('image', file, newName);
            uploadImage(formData);
            const newPath = '/api/images/' + newName;
            tryParseOldCard(file, newPath).then((construct) => {
                console.log("Exif parser failure. Trying old parser");
                if (construct) {
                    resolve(construct);
                } else {
                    reject(new Error("Failed to parse old card"));
                }
            }).catch((error) => {
                console.log("Old Tavern Card Parse Failed", error);
                reject(error);
            });
        });
    });
};


async function processCharacterData(characterData: any, avatar64: string): Promise<Construct> {
    console.log(characterData);
    const construct = new Construct();
    construct.avatar = characterData.avatar;
    if (avatar64) {
        construct.avatar = avatar64;
    }
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

    if (characterData.alternate_greetings && characterData.alternate_greetings.length > 0) {
        characterData.alternate_greetings.forEach((greeting: string) => {
            construct.addGreeting(greeting.replaceAll('\r', ''));
        });
    }
    
    if(characterData.system_prompt && characterData.system_prompt.trim().length > 0){
        construct.authorsNote = characterData.system_prompt.replaceAll('\r', '')
    }

    console.log(construct);
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
                        const construct = await processCharacterData(_json, base64Image);
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

export async function createTavernCardV2(construct: Construct): Promise<TavernCardV2> {
    // You might need to adjust the mapping based on the actual structure of the Construct class
    const data = {
      name: construct.name,
      description: "",
      personality: construct.personality,
      scenario: construct.background,
      first_mes: construct.greetings[0], 
      mes_example: "",
      creator_notes: "", 
      system_prompt: construct.authorsNote || "",
      post_history_instructions: "", 
      alternate_greetings: construct.greetings.slice(1), 
      character_book: undefined, 
      tags: [], 
      creator: "", 
      character_version: "", 
      extensions: {},
    };
  
    const tavernCardV2: TavernCardV2 = {
      spec: 'chara_card_v2',
      spec_version: '2.0',
      data,
    };
  
    return tavernCardV2;
}

export async function saveTavernCardAsImage(construct: Construct) {
    const tavernCardV2 = await createTavernCardV2(construct);
    const jsonString = JSON.stringify(tavernCardV2);
    const base64String = btoa(unescape(encodeURIComponent(jsonString)));
  
    // Convert data URI to Blob
    const byteString = atob(construct.avatar.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
  
    // Extract existing chunks from the PNG
    const chunks = extract(int8Array);
  
    // Create a new text chunk
    const textChunk = encode('chara', base64String);
  
    // Add the new text chunk to the chunks array
    chunks.push({
      name: 'tEXt',
      data: new Uint8Array(textChunk)
    });
  
    // Recompile the PNG with the new chunks
    const newData = encodePng(chunks);
  
    // Convert the new data to a Blob
    const newBlob = new Blob([newData], { type: 'image/png' });
  
    // Save the Blob to a file
    const url = URL.createObjectURL(newBlob);
    return url;
}

export async function getDefaultCharacters(): Promise<string[]>{
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-default-characters');
        ipcRenderer.once('get-default-characters-reply', (event, response) => {
            if(response?.length === 0){
                resolve([]);
            } else {
                resolve(response);
            }
        });
    });
}

export async function getDefaultCharactersFromPublic(){
    const defaultCharacters = await getDefaultCharacters();
    console.log(defaultCharacters);
    if(defaultCharacters.length === 0) return;
    for(let i = 0; i < defaultCharacters.length; i++){
        const character = defaultCharacters[i];
        // get the character image from public folder
        const image = await fetch(`./public/defaults/characters/${character}`);
        const imageBlob = await image.blob();
        const file = new File([imageBlob], character);
        const construct = await importTavernCharacter(file);
        await saveNewConstruct(construct);
    }
}