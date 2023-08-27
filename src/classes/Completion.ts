import { CompletionType } from "@/types";

export type AuthorType = 'AI' | 'User';

// Completion.ts
export class Completion {
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public type: CompletionType = 'novel',
        public content: string = '',
        public author: AuthorType = 'User',
        public dateCreated: number = new Date().getTime(),
        public lastEdited: number = new Date().getTime(),
    ) {}

    setCompletion(type: CompletionType, content: string, author: AuthorType, dateCreated: number, lastEdited: number){
        this.type = type;
        this.content = content;
        this.author = author;
        this.dateCreated = dateCreated;
        this.lastEdited = lastEdited;
    }

    getCompletion(){
        return {
            type: this.type,
            content: this.content,
            author: this.author,
            dateCreated: this.dateCreated,
            lastEdited: this.lastEdited,
        }
    }

    getCompletionType(){
        return this.type;
    }

    getCompletionContent(){
        return this.content;
    }

    getCompletionAuthor(){
        return this.author;
    }

    getCompletionDateCreated(){
        return this.dateCreated;
    }

    getCompletionLastEdited(){
        return this.lastEdited;
    }

    setCompletionType(type: CompletionType){
        this.type = type;
    }

    setCompletionContent(content: string){
        this.content = content;
    }
    
    setCompletionAuthor(author: AuthorType){
        this.author = author;
    }

    setCompletionDateCreated(dateCreated: number){
        this.dateCreated = dateCreated;
    }

    setCompletionLastEdited(lastEdited: number){
        this.lastEdited = lastEdited;
    }

    updateCompletion(content: string){
        this.content = content;
        this.lastEdited = new Date().getTime();
    }
}
