import { Thought } from "./Thought";

export class ThoughtChain{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public agents: string[] = [],
        public thoughts: Thought[] = [],
        public task: string = '',
        public timestamp: number = new Date().getTime(),
    ) {}

    public static fromJSON(json: any): ThoughtChain {
        return new ThoughtChain(
            json._id,
            json.agents,
            json.thoughts,
            json.task,
            json.timestamp,
        );
    }

    getThoughts(){
        return this.thoughts;
    }

    getThoughtsByAgent(agent: string){
        return this.thoughts.filter((thought) => thought.userID === agent);
    }

    getThoughtsByTask(task: string){
        return this.thoughts.filter((thought) => thought.task === task);
    }

    getThoughtsByAgentAndTask(agent: string, task: string){
        return this.thoughts.filter((thought) => thought.userID === agent && thought.task === task);
    }

    getThoughtsByAgentAndTaskAndTimestamp(agent: string, task: string, timestamp: number){
        return this.thoughts.filter((thought) => thought.userID === agent && thought.task === task && thought.timestamp === timestamp);
    }

    getThoughtsByAgentAndTimestamp(agent: string, timestamp: number){
        return this.thoughts.filter((thought) => thought.userID === agent && thought.timestamp === timestamp);
    }

    getThoughtsByTaskAndTimestamp(task: string, timestamp: number){
        return this.thoughts.filter((thought) => thought.task === task && thought.timestamp === timestamp);
    }

    getThoughtsByTimestamp(timestamp: number){
        return this.thoughts.filter((thought) => thought.timestamp === timestamp);
    }

    addThought(thought: Thought){
        this.thoughts.push(thought);
    }

    removeThought(thought: Thought){
        this.thoughts = this.thoughts.filter((t) => t._id !== thought._id);
    }

    getAgents(){
        return this.agents;
    }

    addAgent(agent: string){
        this.agents.push(agent);
    }

    removeAgent(agent: string){
        this.agents = this.agents.filter((a) => a !== agent);
    }

    getTask(){
        return this.task;
    }

    setTask(task: string){
        this.task = task;
    }

    getTimestamp(){
        return this.timestamp;
    }
}