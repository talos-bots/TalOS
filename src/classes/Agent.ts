export class Agent{
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
    ) {}

    setAgent(name: string, nickname: string, avatar: string, commands: string[], visualDescription: string, personality: string, background: string, relationships: string[], interests: string[]){
        this.name = name;
        this.nickname = nickname;
        this.avatar = avatar;
        this.commands = commands;
        this.visualDescription = visualDescription;
        this.personality = personality;
        this.background = background;
        this.relationships = relationships;
        this.interests = interests;
    }

    getAgent(){
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
        }
    }

    getAgentName(){
        return this.name;
    }

    getAgentNickname(){
        return this.nickname;
    }

    getAgentAvatar(){
        return this.avatar;
    }

    getAgentCommands(){
        return this.commands;
    }

    getAgentVisualDescription(){
        return this.visualDescription;
    }

    getAgentPersonality(){
        return this.personality;
    }

    getAgentBackground(){
        return this.background;
    }

    getAgentRelationships(){
        return this.relationships;
    }

    getAgentInterests(){
        return this.interests;
    }

    setAgentName(name: string){
        this.name = name;
    }

    setAgentNickname(nickname: string){
        this.nickname = nickname;
    }

    setAgentAvatar(avatar: string){
        this.avatar = avatar;
    }

    setAgentCommands(commands: string[]){
        this.commands = commands;
    }

    setAgentVisualDescription(visualDescription: string){
        this.visualDescription = visualDescription;
    }

    setAgentPersonality(personality: string){
        this.personality = personality;
    }

    setAgentBackground(background: string){
        this.background = background;
    }

    setAgentRelationships(relationships: string[]){
        this.relationships = relationships;
    }

    setAgentInterests(interests: string[]){
        this.interests = interests;
    }

    addAgentCommand(command: string){   
        this.commands.push(command);
    }

    addAgentRelationship(relationship: string){
        this.relationships.push(relationship);
    }

    addAgentInterest(interest: string){
        this.interests.push(interest);
    }

    removeAgentCommand(command: string){
        this.commands = this.commands.filter((c) => c !== command);
    }

    removeAgentRelationship(relationship: string){
        this.relationships = this.relationships.filter((r) => r !== relationship);
    }

    removeAgentInterest(interest: string){
        this.interests = this.interests.filter((i) => i !== interest);
    }

    getAgentAvatarAsBase64(){
        return this.avatar;
    }

    getAgentAvatarAsBuffer(){
        return Buffer.from(this.avatar, 'base64');
    }

    getAgentAvatarAsBlob(){
        return new Blob([this.avatar], {type: 'image/png'});
    }

    getAgentAvatarAsFile(){
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
}