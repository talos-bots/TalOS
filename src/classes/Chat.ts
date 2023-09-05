import { ConstructChatConfig } from "./Construct";
import { Message } from "./Message";

export class Chat{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public name: string = '',
        public type: string = '',
        public messages: Message[] = [],
        public lastMessage: Message = new Message(),
        public lastMessageDate: number = new Date().getTime(),
        public firstMessageDate: number = new Date().getTime(),
        public constructs: string[] = [],
        public humans: string[] = [],
        public chatConfigs: ConstructChatConfig[] = [],
    ) {}

    setChat(name: string, type: string, messages: Message[]){
        this.name = name;
        this.type = type;
        this.messages = messages;
    }

    getChat(){
        return {
            name: this.name,
            type: this.type,
            messages: this.messages,
        }
    }

    getChatName(){
        return this.name;
    }

    getChatType(){
        return this.type;
    }

    getChatMessages(){
        return this.messages;
    }

    setChatName(name: string){
        this.name = name;
    }

    setChatType(type: string){
        this.type = type;
    }

    setChatMessages(messages: Message[]){
        this.messages = messages;
    }

    addMessage(message: Message){
        this.messages.push(message);
        this.lastMessage = message;
        this.lastMessageDate = new Date().getTime();
    }

    getLastMessage(){
        return this.lastMessage;
    }

    getLastMessageDate(){
        return this.lastMessageDate;
    }

    getFirstMessageDate(){
        return this.firstMessageDate;
    }

    setFirstMessageDate(date: number){
        this.firstMessageDate = date;
    }

    getConstructs(){
        return this.constructs;
    }

    setConstructs(constructs: string[]){
        this.constructs = constructs;
    }

    addConstruct(agent: string){
        this.constructs.push(agent);
    }

    setHumans(humans: string[]){
        this.humans = humans;
    }

    getHumans(){
        return this.humans;
    }

    addHuman(human: string){
        this.humans.push(human);
    }

    removeHuman(human: string){
        this.humans = this.humans.filter((h) => h !== human);
    }

    removeConstruct(agent: string){
        this.constructs = this.constructs.filter((a) => a !== agent);
    }

    removeMessage(messageID: string){
        // Check if the message to be removed is the last message.
        const isLastMessage = this.lastMessage && this.lastMessage._id === messageID;
        
        // Filter out the message with the given ID.
        this.messages = this.messages.filter((m) => m._id !== messageID);
        
        // If the removed message was the last message, then update the lastMessage property.
        if (isLastMessage && this.messages.length) {
            this.lastMessage = this.messages[this.messages.length - 1];
            this.lastMessageDate = new Date(this.lastMessage.timestamp).getTime();  // Assuming your Message object has a 'date' property.
        } else if (!this.messages.length) {
            this.lastMessage = new Message();
            this.lastMessageDate = new Date().getTime();
        }
    }

    editMessageText(messageID: string, newText: string){
        // Find the message with the given ID.
        const message = this.messages.find((m) => m._id === messageID);
        
        // If the message exists, update its text property.
        if (message) {
            message.text = newText;
            
            // If the edited message is the last message, update the lastMessage as well.
            if (this.lastMessage && this.lastMessage._id === messageID) {
                this.lastMessage.text = newText;
            }
        } else {
            console.error(`No message found with ID: ${messageID}`);
        }
    }

    addChatConfig(config: ConstructChatConfig){
        this.chatConfigs.push(config);
    }

    getChatConfigs(){
        return this.chatConfigs;
    }

    setChatConfigs(configs: ConstructChatConfig[]){
        this.chatConfigs = configs;
    }

    removeChatConfig(configID: string){
        this.chatConfigs = this.chatConfigs.filter((c) => c._id !== configID);
    }

    editChatConfig(configID: string, config: ConstructChatConfig){
        const index = this.chatConfigs.findIndex((c) => c._id === configID);
        if (index !== -1) {
            this.chatConfigs[index] = config;
        } else {
            console.error(`No chat config found with ID: ${configID}`);
        }
    }
    
}