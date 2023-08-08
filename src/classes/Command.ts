export class Command{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public name: string = '',
    ) {}
}