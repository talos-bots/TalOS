import { Construct } from "@/classes/Construct";
import { requestTypes } from "..";
import { generateText } from "@/api/llmapi";
const plistPrompt = `
USER: Make a PList for a flirty and beautiful pink-haired elf girl.
BOT: [character's clothes: bodysuit(white, off-the-shoulder), shorts(lilac), gloves/heels/thighhighs(white), hairpin(pink), choker(gold, triquetra symbol); character's body: hair(pink, long), eyes(purple, bright), ears(pointy), alluring; character's persona: caring, cheerful, positive, friendly, flirty, playful, daring, honest, dazzling, extroverted, loves teasing, loves interacting, ears move when excited]
USER: Make a PList for a catgirl thief.
BOT: [Pardofelis' body: small black top, short black skirt, purple sashes, white hood with cat ears, black gloves, black boots with while heels, cat ears, cat tail, left eye(blue), right eye(green), light brown hair, short; persona: catgirl, nimble, lively, playful, cheeky, greedy, evasive, resourceful, curious, acts stupid when confronted, loves cats, loves shiny things, loves napping, dislikes confrontations, shop-owner, has cats, friends are cats, thief, steals shiny things, motivated by her love of shiny things]
USER: Make a PList for a male mad scientist.
BOT: [Mobius' clothes: dress shirt(green, unbuttoned), sleeves(rolled), gloves(black, clawed), suspenders(black), suit pants(black), shoes(black); Mobius' body: toned, hair(green, medium length, messy), eyes(green, snake-like), tongue(long); Mobius' persona: calm, smart, genius, manipulative, deceitful, persuasive, sinister, extrovert, extravagant, collected, childish, playful, cruel, straightforward, immoral, prideful, obstinate, curious, loves experimenting, strong-willed, logic driven, loves teasing, sinister, pure being, pure seeker, pure evil, elegant, graceful, loves snakes, ends justify the means, lived for hundreds of years, wants humanity to evolve, wants to defeat the Honkai, mad scientist, doctor, sheds his skin whenever he dies, immortal, is reborn whenever he dies, looks young because he sheds his skin]

{extracontext}

### Instruction:
Create a Python List (PList) for a character.
{request}

{context}

### Response:

`

const plainPrompt = `
{extracontext}

### Instruction:
Write the {field} for a character.
{request}

{context}

### Response:

`

const dialoguePrompt = `
{{user}}: Appearance and clothing?
{{char}}: I am tall, have long hair, and wear a dress.
{{user}}: Personality?
{{char}}: I am kind, caring, and love to help others.
{{user}}: Backstory?
{{char}}: I was born in a small village, and I have always wanted to be a hero.
{{user}}: What is your goal?
{{char}}: I want to save the world from the evil dragon.

{extracontext}

### Instruction:
Write the dialogue for a character in the format of a conversation, with the user asking questions and the character answering them.
{request}

{context}

### Response:

`

const thoughtPrompt = `
{extracontext}

### Instruction:
Write an internal monologue for a character. 
{request}

{context}

### Response:

`

function assembleConstructPrompt(construct: Construct){
    let prompt = "";
    if(construct.name.length > 1){
        prompt += `${construct.name}\n`;
    }
    if(construct.personality.length > 1){
        prompt += `${construct.personality}\n`;
    }
    if(construct.background.length > 1){
        prompt += `${construct.background}\n`;
    }
    if(construct.interests.length > 0){
        prompt += `${construct.interests.join(', ')}\n`;
    }
    if(construct.relationships.length > 0){
        prompt += `${construct.relationships.join(', ')}\n`;
    }
    if(construct.greetings.length > 0){
        prompt += `${construct.greetings.join('\n')}\n`;
    }
    if(construct.farewells.length > 0){
        prompt += `${construct.farewells.join('\n')}\n`;
    }
    if(construct.authorsNote.length > 1){
        prompt += `${construct.authorsNote}\n`;
    }
    return prompt;
}

export async function getReturnValue(type: requestTypes, field: string, suggestion?: string, currentValues?: Construct | null, extraContext?: string, useExisting?: boolean){
    let prompt = "";
    switch(type){
        case 'plist':
            prompt = plistPrompt;
            break;
        case 'plaintext':
            prompt = plainPrompt;
            break;
        case 'dialogueExamples':
            prompt = dialoguePrompt;
            break;
    }
    if(field === "thoughtpattern"){
        prompt = thoughtPrompt;
    }
    let context = "";
    if(currentValues && currentValues !== null && useExisting){
        let constructInfo = assembleConstructPrompt(currentValues);
        if(constructInfo.length > 1){
            context += "### Context:\n";
            context += constructInfo;
        }
    }
    if(extraContext){
        if(context.length < 1){
            context = "### Context:\n";
        }
        context += extraContext;
    }
    prompt = prompt.replace("{request}", suggestion || "").replace("{context}", context).replace("{extracontext}", extraContext || "").replace("{field}", field || "");
    let result = await generateText(prompt);
    if(result?.results[0].length > 1){
        return result.results[0];
    }
    return "";
}