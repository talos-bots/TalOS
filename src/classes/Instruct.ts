export class Instruct{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public name: string = '',
    ) {}

    setName(name: string) {
        this.name = name;
    }
}