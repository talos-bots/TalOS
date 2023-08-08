import { Message } from "./Message";

export class Chat{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public name: string = '',
        public type: string = '',
        public messages: Message[] = [],
        public lastMessage: Message = new Message(),
        public lastMessageDate: Date = new Date(),
        public firstMessageDate: Date = new Date(),
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
        this.lastMessageDate = new Date();
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

    setFirstMessageDate(date: Date){
        this.firstMessageDate = date;
    }
}