import { Emotion } from "@/types";

export class Construct{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public name: string = '',
        public nickname: string = '',
        public avatar: string = '',
        public commands: string[] = [],
        public visualDescription: string = '',
        public personality: string = '',
        public background: string = '',
        public relationships: string[] = [],
        public interests: string[] = [],
        public greetings: string[] = [],
        public farewells: string[] = [],
        public authorsNote: string = '',
        public defaultConfig: DefaultChatConfig = new DefaultChatConfig(),
        public thoughtPattern: string = '',
        public sprites: Sprite[] = [],
    ) {}

    setConstruct(name: string, nickname: string, avatar: string, commands: string[], visualDescription: string, personality: string, background: string, relationships: string[], interests: string[], greetings: string[], farewells: string[], authorsNote: string){
        this.name = name;
        this.nickname = nickname;
        this.avatar = avatar;
        this.commands = commands;
        this.visualDescription = visualDescription;
        this.personality = personality;
        this.background = background;
        this.relationships = relationships;
        this.interests = interests;
        this.greetings = greetings;
        this.farewells = farewells;
        this.authorsNote = authorsNote;
    }

    getConstruct(){
        return {
            name: this.name,
            nickname: this.nickname,
            avatar: this.avatar,
            commands: this.commands,
            visualDescription: this.visualDescription,
            personality: this.personality,
            background: this.background,
            relationships: this.relationships,
            interests: this.interests,
            greetings: this.greetings,
            farewells: this.farewells,
            authorsNote: this.authorsNote,
        }
    }

    getConstructName(){
        return this.name;
    }

    getConstructNickname(){
        return this.nickname;
    }

    getConstructAvatar(){
        return this.avatar;
    }

    getConstructCommands(){
        return this.commands;
    }

    getConstructVisualDescription(){
        return this.visualDescription;
    }

    getConstructPersonality(){
        return this.personality;
    }

    getConstructBackground(){
        return this.background;
    }

    getConstructRelationships(){
        return this.relationships;
    }

    getConstructInterests(){
        return this.interests;
    }

    setConstructName(name: string){
        this.name = name;
    }

    setConstructNickname(nickname: string){
        this.nickname = nickname;
    }

    setConstructAvatar(avatar: string){
        this.avatar = avatar;
    }

    setConstructCommands(commands: string[]){
        this.commands = commands;
    }

    setConstructVisualDescription(visualDescription: string){
        this.visualDescription = visualDescription;
    }

    setConstructPersonality(personality: string){
        this.personality = personality;
    }

    setConstructBackground(background: string){
        this.background = background;
    }

    setConstructRelationships(relationships: string[]){
        this.relationships = relationships;
    }

    setConstructInterests(interests: string[]){
        this.interests = interests;
    }

    addConstructCommand(command: string){   
        this.commands.push(command);
    }

    addConstructRelationship(relationship: string){
        this.relationships.push(relationship);
    }

    addConstructInterest(interest: string){
        this.interests.push(interest);
    }

    removeConstructCommand(command: string){
        this.commands = this.commands.filter((c) => c !== command);
    }

    removeConstructRelationship(relationship: string){
        this.relationships = this.relationships.filter((r) => r !== relationship);
    }

    removeConstructInterest(interest: string){
        this.interests = this.interests.filter((i) => i !== interest);
    }

    getConstructAvatarAsBase64(){
        return this.avatar;
    }

    getConstructAvatarAsBuffer(){
        return Buffer.from(this.avatar, 'base64');
    }

    getConstructAvatarAsBlob(){
        return new Blob([this.avatar], {type: 'image/png'});
    }

    getConstructAvatarAsFile(){
        return new File([this.avatar], this.name, {type: 'image/png'});
    }
    
    setGreetings(greetings: string[]){
        this.greetings = greetings;
    }

    getGreetings(){
        return this.greetings;
    }

    addGreeting(greeting: string){
        this.greetings.push(greeting);
    }

    removeGreeting(greeting: string){
        this.greetings = this.greetings.filter((g) => g !== greeting);
    }

    setFarewells(farewells: string[]){
        this.farewells = farewells;
    }

    getFarewells(){
        return this.farewells;
    }

    addFarewell(farewell: string){
        this.farewells.push(farewell);
    }

    removeFarewell(farewell: string){
        this.farewells = this.farewells.filter((f) => f !== farewell);
    }

    getAuthorsNote(){
        return this.authorsNote;
    }

    setAuthorsNote(authorsNote: string){
        this.authorsNote = authorsNote;
    }

    addSprite(sprite: Sprite){
        const spriteIndex = this.sprites.findIndex((s) => s.emotion === sprite.emotion);
        if(spriteIndex === -1){
            this.sprites.push(sprite);
        }else{
            this.sprites[spriteIndex] = sprite;
        }
    }
}

export class DefaultChatConfig{
    constructor(
        public doInstruct: boolean = false,
        public doMemories: boolean = false,
        public doActions: boolean = false,
        public doSprites: boolean = false,
        public doVoice: boolean = false,
        public doLurk: boolean = false,
        public doRandomGreeting: boolean = false,
        public doRandomFarewell: boolean = false,
        public doRandomThought: boolean = false,
        public haveThoughts: boolean = false,
        public thinkBeforeChat: boolean = false,
        public replyToConstruct: number = 0.50,
        public replyToConstructMention: number = 0.75,
        public replyToUser: number = 0.50,
        public replyToUserMention: number = 1,
        public thoughtChance: number = 0.50,
    ){}

    setDefaultChatConfig(doInstruct: boolean, doMemories: boolean, doActions: boolean, doSprites: boolean, doVoice: boolean, doLurk: boolean, doRandomGreeting: boolean, doRandomFarewell: boolean, doRandomThought: boolean, haveThoughts: boolean, thinkBeforeChat: boolean, replyToConstruct: number, replyToConstructMention: number, replyToUser: number, replyToUserMention: number, thoughtChance: number){
        this.doInstruct = doInstruct;
        this.doMemories = doMemories;
        this.doActions = doActions;
        this.doSprites = doSprites;
        this.doVoice = doVoice;
        this.doLurk = doLurk;
        this.doRandomGreeting = doRandomGreeting;
        this.doRandomFarewell = doRandomFarewell;
        this.doRandomThought = doRandomThought;
        this.haveThoughts = haveThoughts;
        this.thinkBeforeChat = thinkBeforeChat;
        this.replyToConstruct = replyToConstruct;
        this.replyToConstructMention = replyToConstructMention;
        this.replyToUser = replyToUser;
        this.replyToUserMention = replyToUserMention;
        this.thoughtChance = thoughtChance;

    }

    getDefaultChatConfig(){
        return {
            doInstruct: this.doInstruct,
            doMemories: this.doMemories,
            doActions: this.doActions,
            doSprites: this.doSprites,
            doVoice: this.doVoice,
            doLurk: this.doLurk,
            doRandomGreeting: this.doRandomGreeting,
            doRandomFarewell: this.doRandomFarewell,
            doRandomThought: this.doRandomThought,
            haveThoughts: this.haveThoughts,
            thinkBeforeChat: this.thinkBeforeChat,
            replyToConstruct: this.replyToConstruct,
            replyToConstructMention: this.replyToConstructMention,
            replyToUser: this.replyToUser,
            replyToUserMention: this.replyToUserMention,
            thoughtChance: this.thoughtChance,
        }
    }
}

export class ConstructChatConfig{
    constructor(
        public _id: string = '',
        public doInstruct: boolean = false,
        public doMemories: boolean = false,
        public doActions: boolean = false,
        public doSprites: boolean = false,
        public doVoice: boolean = false,
        public doLurk: boolean = false,
        public doRandomGreeting: boolean = false,
        public doRandomFarewell: boolean = false,
        public doRandomThought: boolean = false,
        public haveThoughts: boolean = false,
        public thinkBeforeChat: boolean = false,
        public replyToConstruct: number = 0.50,
        public replyToConstructMention: number = 0.75,
        public replyToUser: number = 0.50,
        public replyToUserMention: number = 1,
        public thoughtChance: number = 0.50,
    ){}

    createChatConfigFromDefault(defaultChatConfig: DefaultChatConfig, constructID: string){
        this._id = constructID;
        this.doInstruct = defaultChatConfig.doInstruct;
        this.doMemories = defaultChatConfig.doMemories;
        this.doActions = defaultChatConfig.doActions;
        this.doSprites = defaultChatConfig.doSprites;
        this.doVoice = defaultChatConfig.doVoice;
        this.doLurk = defaultChatConfig.doLurk;
        this.doRandomGreeting = defaultChatConfig.doRandomGreeting;
        this.doRandomFarewell = defaultChatConfig.doRandomFarewell;
        this.doRandomThought = defaultChatConfig.doRandomThought;
        this.haveThoughts = defaultChatConfig.haveThoughts;
        this.thinkBeforeChat = defaultChatConfig.thinkBeforeChat;
        this.replyToConstruct = defaultChatConfig.replyToConstruct;
        this.replyToConstructMention = defaultChatConfig.replyToConstructMention;
        this.replyToUser = defaultChatConfig.replyToUser;
        this.replyToUserMention = defaultChatConfig.replyToUserMention;
        this.thoughtChance = defaultChatConfig.thoughtChance;
    }
}
export class Sprite{
    constructor(
        public emotion: Emotion,
        public image64: string = '',
    ){}

    setSprite(emotion: Emotion, image64: string){
        this.emotion = emotion;
        this.image64 = image64;
    }

    getSprite(){
        return {
            emotion: this.emotion,
            image64: this.image64,
        }
    }
    
    getSpriteEmotion(){
        return this.emotion;
    }

    getSpriteImage64(){
        return this.image64;
    }

    setSpriteEmotion(emotion: Emotion){
        this.emotion = emotion;
    }

    setSpriteImage64(image64: string){
        this.image64 = image64;
    }
}