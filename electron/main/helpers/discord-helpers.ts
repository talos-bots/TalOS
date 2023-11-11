import { txt2img } from "../api/sd.js";
import { ConstructInterface } from "../types/types.js";

export async function createSelfieForConstruct(construct: ConstructInterface, intent: string, subject: string) {
    if (!construct) return null;
    let prompt = construct.visualDescription + ', ' + intent + ', ' + subject;
    const imageData = await txt2img(prompt);
    if(!imageData) return null;
    return imageData;
}
