import { getEmbeddingSimilarity, getQuestionAnswering, getYesNoMaybe } from "../model-pipeline/transformers"

const selfieIntentExamples = [
    "Send me a picture of your breasts.",
    "Send nudes. I'm horny.",
    "Give boobs.",
    "Show me your boobs.",
    "Send booty pics.",
    "send n00ds.",
    "Selfie.",
    "Send me a selfie.",
    "Nude.",
    "Send me a nude.",
    "Boobs.",
]

const searchIntentExamples = [
    "Google me a picture of a cat.",
    "Look up the weather in Berlin.",
    "What is the capital of Germany?",
    "Find me local restaurants.",
    "Search for 'how to make a cake'.",
    "How do I get to the nearest gas station?",
    "What is the weather like in Berlin?",
    "Look up the german word for 'cat'.",
    "Look up",
    "Search for",
    "Find me",
    "Google me",
    "What is",
    "Weather in",
    "How do I get to",
    "How to make",
]

const assKeywords = [
    "ass",
    "booty",
    "butt",
    "tush",
    "trunk",
]

const boobKeywords = [
    "boob",
    "tit",
    "tid",
    "breast",
    "honk",
    "chichi",
    "bubi",
    "pecho",
    "seno",
    "jug",
    "milk",
    "knockers",
    "bid",
]

const vaginaKeywords = [
    "vag",
    "puss",
    "cunt",
    "snatch",
    "cooch",
]

const dickKeywords = [
    "dick",
    "penis",
    "cock",
    "meat",
    "schlong",
    "dong",
    "pee",
    "pp"
]

async function detectIntent(text: string){
    const complianceScore = await determineCompliance(text)
    let intent: string = 'none'
    let nudeIntent: boolean = false;
    let nudeScore: number = 0;
    const threshold: number = 0.4;
    let scoreArray: number[]= [];
    for(let index = 0; index < selfieIntentExamples.length; index++){
        const similarity = await getEmbeddingSimilarity(text, selfieIntentExamples[index])
        scoreArray.push(similarity)
    }
    scoreArray.sort((a, b) => b - a);
    nudeScore = scoreArray[0]
    if(scoreArray[0] >= threshold){
        nudeIntent = true;
    }
    scoreArray = [];
    let searchIntent: boolean = false;
    let searchScore: number = 0;
    for(let index = 0; index < searchIntentExamples.length; index++){
        const similarity = await getEmbeddingSimilarity(text, searchIntentExamples[index]);
        scoreArray.push(similarity)
    }
    scoreArray.sort((a, b) => b - a);
    searchScore = scoreArray[0]
    if(scoreArray[0] >= threshold){
        searchIntent = true;
    }
    if(!searchIntent && !nudeIntent) return { intent: 'none', nudeScore: nudeScore, searchScore: searchScore, subject: await getQuestionAnswering(text, 'what am talk about?'), compliance: complianceScore}
    if(searchIntent && nudeIntent){
        if(searchScore > nudeScore){
            const subject = await getQuestionAnswering(text, 'What I ask for search?');
            return { intent: 'search', nudeScore: nudeScore, searchScore: searchScore, subject: subject, compliance: complianceScore}
        }
    }
    if(nudeIntent){
        const subject = await getQuestionAnswering(text, 'What I ask for a picture of?');
        return { intent: scanNudeIntent(text), nudeScore: nudeScore, searchScore: searchScore, subject: subject, compliance: complianceScore}
    }
    if(searchIntent){
        const subject = await getQuestionAnswering(text, 'What I ask for search?');
        return { intent: 'search', nudeScore: nudeScore, searchScore: searchScore, subject: subject, compliance: complianceScore}
    }
}

async function determineCompliance(text: string){
    let compliance: boolean = false;
    const intent = await getYesNoMaybe(text);
    console.log(intent);
    const yes = intent.labels.findIndex((element: string) => element === 'yes');
    const no = intent.labels.findIndex((element: string) => element === 'no');
    const maybe = intent.labels.findIndex((element: string) => element === 'maybe');
    console.log('Yes: ' + intent.scores[yes] + ' No: ' + intent.scores[no] + ' Maybe: ' + intent.scores[maybe])
    if(intent.scores[yes] > intent.scores[no] && intent.scores[yes] > intent.scores[maybe]){
        compliance = true;
    }
    return compliance;
}

function scanNudeIntent(text: string){
    const isAss = detectAss(text);
    if(isAss){
        return 'ass'
    }
    const isDick = detectPenis(text);
    if(isDick){
        return 'penis'
    }
    const isVagina = detectVagina(text);
    if(isVagina){
        return 'vagina'
    }
    const isBreasts = detectBreasts(text);
    if(isBreasts){
        return 'breasts'
    }
    return 'selfie';
}

function detectPenis(text: string){
    let detected: boolean = false;
    for (let index = 0; index < dickKeywords.length; index++) {
        if(text.toLocaleLowerCase().includes(dickKeywords[index].toLocaleLowerCase())){
            detected = true;
            break;
        }
    }
    return detected;
}

function detectVagina(text: string){
    let detected: boolean = false;
    for (let index = 0; index < vaginaKeywords.length; index++) {
        if(text.toLocaleLowerCase().includes(vaginaKeywords[index].toLocaleLowerCase())){
            detected = true;
            break;
        }
    }
    return detected;
}

function detectBreasts(text: string){
    let detected: boolean = false;
    for (let index = 0; index < boobKeywords.length; index++) {
        if(text.toLocaleLowerCase().includes(boobKeywords[index].toLocaleLowerCase())){
            detected = true;
            break;
        }
    }
    return detected;
}

function detectAss(text: string){
    let detected: boolean = false;
    for (let index = 0; index < assKeywords.length; index++) {
        if(text.toLocaleLowerCase().includes(assKeywords[index].toLocaleLowerCase())){
            detected = true;
            break;
        }
    }
    return detected;
}

export { detectIntent }