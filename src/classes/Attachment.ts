export class Attachment{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public name: string = '',
        public type: string = '',
        public data: string = '',
    ) {}

    setAttachment(name: string, type: string, data: string){
        this.name = name;
        this.type = type;
        this.data = data;
    }

    getAttachment(){
        return {
            name: this.name,
            type: this.type,
            data: this.data,
        }
    }

    getAttachmentName(){
        return this.name;
    }

    getAttachmentType(){
        return this.type;
    }

    getAttachmentData(){
        return this.data;
    }

    setAttachmentName(name: string){
        this.name = name;
    }

    setAttachmentType(type: string){
        this.type = type;
    }

    setAttachmentData(data: string){
        this.data = data;
    }

    getAttachmentDataAsBase64(){
        return this.data;
    }

    getAttachmentDataAsBuffer(){
        return Buffer.from(this.data, 'base64');
    }

    getAttachmentDataAsBlob(){
        return new Blob([this.data], {type: this.type});
    }

    getAttachmentDataAsFile(){
        return new File([this.data], this.name, {type: this.type});
    }
}