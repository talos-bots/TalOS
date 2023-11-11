import { CompletionType } from "../types";
import { Completion } from "./Completion";

export class CompletionLog{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public name: string = 'New Completion Log',
        public type: CompletionType = 'novel',
        public completions: Completion[] = [],
        public lastCompletion: Completion = new Completion(),
        public lastCompletionDate: number = new Date().getTime(),
    ) {}

    setCompletionLog(name: string, type: CompletionType, completions: Completion[]){
        this.name = name;
        this.type = type;
        this.completions = completions;
    }

    getCompletionLog(){
        return {
            name: this.name,
            type: this.type,
            completions: this.completions,
        }
    }

    getCompletionLogName(){
        return this.name;
    }

    getCompletionLogType(){
        return this.type;
    }

    getCompletionLogCompletions(){
        return this.completions;
    }

    setCompletionLogName(name: string){
        this.name = name;
    }

    setCompletionLogType(type: CompletionType){
        this.type = type;
    }

    setCompletionLogCompletions(completions: Completion[]){
        this.completions = completions;
        this.lastCompletion = completions[completions.length - 1];
        this.lastCompletionDate = new Date().getTime();
    }

    addCompletion(completion: Completion){
        this.completions.push(completion);
        this.lastCompletion = completion;
        this.lastCompletionDate = new Date().getTime();
    }

    getLastCompletion(){
        return this.lastCompletion;
    }

    getLastCompletionDate(){
        return this.lastCompletionDate;
    }

    setLastCompletion(completion: Completion){
        this.lastCompletion = completion;
    }

    setLastCompletionDate(date: number){
        this.lastCompletionDate = date;
    }
}