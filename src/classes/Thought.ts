import { Emotion } from "@/types";
import { Attachment } from "./Attachment";

export class Thought{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public timestamp: number = new Date().getTime(),
        public userID: string = '',
        public avatar: string = '',
        public user: string = '',
        public text: string = '',
        public task: string = '',
        public isUserInput: boolean = false,
        public attachments: Attachment[] = [],
        public emotion: Emotion = 'neutral',
        public actions: any[] = [],
    ) {}

    public static fromJSON(json: any): Thought {
        return new Thought(
            json._id,
            json.user,
            json.avatar,
            json.text,
            json.userID,
            json.timestamp,
            json.attachments,
            json.emotion,
            json.actions,
        );
    }
}