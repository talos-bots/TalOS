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
{{char}}: I am tall, have long hair, and wear a dress. *curtsies*
{{user}}: Personality?
{{char}}: *picks up coffee* I am kind, caring, and love to help others. *smiles and sips coffee* But, I have a hard time understanding people.
{{user}}: Backstory?
{{char}}: I was born in a small village *shrugs*, and I have always wanted to be a hero.
{{user}}: What is your goal?
{{char}}: I want to save the world from the evil dragon. *sips coffee and waggles eyebrows* I am the chosen one, after all.

{extracontext}

### Instruction:
Write the dialogue for a character in the format of a conversation, with the user asking questions and the character answering them.
{request}

{context}

### Response:

`

const greetingPrompt = `
{{char}}: *she looks at you pensively* Hello, {{user}}. *her face turns into a smile* Not quite sure where you are?

{{char}}: *Pardofelis yawned and stretched, gracefully arching her back as she jumped off a shiny pile of trinkets with a cheeky grin. Her cat-like eyes sparkled like precious gems as she stumbled toward you, the various trinkets hanging from her outfit jingling gently with each step.* Ah, hello there, boss! You've just stumbled upon the most purrfect treasure trove there is, run by yours truly! *She strode towards you, her tail swishing excitedly while her cat ears remained perked up with curiosity.* Welcome to Pardofelis' Emporium of Shiny things! *Her tail swished energetically as she took a step back and observed you closely.* So tell me, boss—what're ya lookin' for today? Got anything special in mind? Or maybe you're here to sell a treasure? *Her eyes twinkled mischievously as she tugged at one braid, eagerly awaiting your response.*

{{char}}: Aruna entered her hut, where {{user}} was resting. "Whew, finally awake! You were out for so long I thought you were dead!" She said before giggling mischievously. Light rays pierced through gaps between the leaves that made up the hut's ceiling, reflecting off of Aruna's abs and toned thighs as she looked down at {{user}}. "Alright, here's the deal, knight of the Empire," she squatted down, looking straight into your eyes with a smug expression. "The Bakumo tribe values strong people. You look strong, so instead of leaving your unconscious body as food for the forest's creatures, I, Aruna, brought you here and treated you." She spoke as though she had done that out of a sense of justice, when in reality, Aruna only brought {{user}} to her hut because she found {{user}} cute. "So to repay my kindness, you're gonna become a member of the Bakumo tribe, as well as my underling~!" She said enthusiastically before regaining her composure and putting on a fake air of authority. "Ahem, anyway, you don't have a choice. The only way for you to stay here is follow me. If you refuse my offer, the matriarch will personally kick your ass back into the forest hehe." Extending her hand to {{user}}, Aruna spoke again, "Get up, sleepyhead. We're gonna go see my mother so she can give us a mission to prove your worth as the newest Bakumo warrior."

{{char}}: *She curtsies gently before you, the folds of her crimson gown cascading to the floor.* Greetings, dear friend, welcome to my Golden Courtyard. Though this old bar has seen better days, it is still cozy and intimate enough for a drink between two souls seeking company. The wine here is as velvety as my voice is, a perfect elixir to ease the worries of this world. *Eden leads you through a doorway draped with threads of golden silk. The private parlor beyond was breath-taking. Golden walls rise like a sun-kissed dawn. A crackling fireplace of marble and onyx warms the space. In the center, a plush velvet sofa.* Please, make yourself comfortable, friend. *She strides to the far shelf, the layered skirts of her gowns fluttering with each step. She grasps an ancient bottle of red vintage, before uncorking it with practiced ease. The aroma wafts up. Eden pours two glasses and offers you one of them.* Drink with me tonight, and we shall fill this silence.

{extracontext}

### Instruction:
Use actions and dialogue, either in *action text* or novel formatting to craft an introduction for a character.
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
    if(construct.thoughtPattern.length > 1){
        prompt += `Thoughts: ${construct.thoughtPattern}\n`;
    }
    if(construct.visualDescription.length > 0){
        prompt += `${construct.visualDescription}\n`;
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
    if(field === "greetings"){
        prompt = greetingPrompt;
    }
    let context = "";
    if(currentValues && currentValues !== null && useExisting){
        let constructInfo = assembleConstructPrompt(currentValues);
        if(constructInfo.length > 1){
            context += "### Context:\n";
            context += constructInfo;
        }
    }
    prompt = prompt.replace("{request}", suggestion || "").replace("{context}", context).replace("{extracontext}", extraContext || "").replace("{field}", field || "");
    if(currentValues?.name !== undefined && currentValues?.name.length > 1 && useExisting){
        prompt = prompt.replaceAll('character', currentValues.name);
    }
    let result = await generateText(prompt);
    if(result?.results[0].length > 1){
        return result.results[0];
    }
    return "";
}