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
        public defaultConfig: DefaultChatConfig = {
            doInstruct: false,
            doMemories: false,
            doActions: false,
            doSprites: false,
            doVoice: false,
            doLurk: false,
            doRandomGreeting: false,
            doRandomFarewell: false,
            doRandomThought: false,
            haveThoughts: false,
            thinkBeforeChat: false,
            replyToConstruct: 0.35,
            replyToConstructMention: 0.75,
            replyToUser: 0.75,
            replyToUserMention: 1,
        }
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
}

export type DefaultChatConfig = {
    doInstruct: boolean;
    doMemories: boolean;
    doActions: boolean;
    doSprites: boolean;
    doVoice: boolean;
    doLurk: boolean;
    doRandomGreeting: boolean;
    doRandomFarewell: boolean;
    doRandomThought: boolean;
    haveThoughts: boolean;
    thinkBeforeChat: boolean;
    replyToConstruct: number;
    replyToConstructMention: number;
    replyToUser: number;
    replyToUserMention: number;
}

export type ConstructChatConfig = {
    _id: string;
    doInstruct: boolean;
    doMemories: boolean;
    doActions: boolean;
    doSprites: boolean;
    doVoice: boolean;
    doLurk: boolean;
    doRandomGreeting: boolean;
    doRandomFarewell: boolean;
    doRandomThought: boolean;
    haveThoughts: boolean;
    thinkBeforeChat: boolean;
    replyToConstruct: number;
    replyToConstructMention: number;
    replyToUser: number;
    replyToUserMention: number;
}