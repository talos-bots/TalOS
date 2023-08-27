import { Attachment } from "./Attachment";

export class Message{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public user: string = '',
        public avatar: string = '',
        public text: string = '',
        public userID: string = '',
        public timestamp: number = new Date().getTime(),
        public origin: string = '',
        public isHuman: boolean = false,
        public isCommand: boolean = false,
        public isPrivate: boolean = false,
        public participants: string[] = [],
        public attachments: Attachment[] = [],
    ) {}

    setMessage(user: string, userID: string, text: string, timestamp: number, origin: string, isHuman: boolean, isCommand: boolean, isPrivate: boolean, participants: string[], attachments: Attachment[]){
        this.user = user;
        this.text = text;
        this.userID = userID;
        this.timestamp = timestamp;
        this.origin = origin;
        this.isHuman = isHuman;
        this.isCommand = isCommand;
        this.isPrivate = isPrivate;
        this.participants = participants;
        this.attachments = attachments;
    }

    getMessage(){
        return {
            user: this.user,
            text: this.text,
            userID: this.userID,
            timestamp: this.timestamp,
            origin: this.origin,
            isCommand: this.isCommand,
            isPrivate: this.isPrivate,
            participants: this.participants,
            attachments: this.attachments,
        }
    }

    getMessageUser(){
        return this.user;
    }

    getMessageText(){
        return this.text;
    }

    getMessageTimestamp(){
        return this.timestamp;
    }

    getMessageOrigin(){
        return this.origin;
    }

    getMessageIsCommand(){
        return this.isCommand;
    }

    getMessageIsPrivate(){
        return this.isPrivate;
    }

    getMessageParticipants(){
        return this.participants;
    }

    getMessageAttachments(){
        return this.attachments;
    }

    setMessageUser(user: string){
        this.user = user;
    }

    setMessageText(text: string){
        this.text = text;
    }

    setMessageTimestamp(timestamp: number){
        this.timestamp = timestamp;
    }

    setMessageOrigin(origin: string){
        this.origin = origin;
    }

    setMessageIsCommand(isCommand: boolean){
        this.isCommand = isCommand;
    }

    setMessageIsPrivate(isPrivate: boolean){
        this.isPrivate = isPrivate;
    }

    setMessageParticipants(participants: string[]){
        this.participants = participants;
    }

    setMessageAttachments(attachments: Attachment[]){
        this.attachments = attachments;
    }

    addMessageAttachment(attachment: Attachment){
        this.attachments.push(attachment);
    }

    removeMessageAttachment(attachment: Attachment){
        this.attachments = this.attachments.filter((att) => att._id !== attachment._id);
    }

    getMessageAttachmentsAsBase64(){
        let attachments: string[] = [];
        this.attachments.forEach((attachment) => {
            attachments.push(attachment.data);
        });
        return attachments;
    }

    setUserID(userID: string){
        this.userID = userID;
    }

    getUserID(){
        return this.userID
    }

    setIsHuman(isHuman: boolean){
        this.isHuman = isHuman;
    }

    getIsHuman(){
        return this.isHuman;
    }
}