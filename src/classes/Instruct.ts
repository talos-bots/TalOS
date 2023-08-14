export class Instruct{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public name: string = '',
        public randomEvents: string[] = [],
    ) {}

    setName(name: string) {
        this.name = name;
    }

    getName(){
        return this.name;
    }

    setRandomEvents(randomEvents: string[]) {
        this.randomEvents = randomEvents;
    }

    getRandomEvents(){
        return this.randomEvents;
    }

    addRandomEvent(randomEvent: string){
        this.randomEvents.push(randomEvent);
    }

    removeRandomEvent(randomEvent: string){
        this.randomEvents.splice(this.randomEvents.indexOf(randomEvent), 1);
    }
}