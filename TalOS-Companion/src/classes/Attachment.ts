export class Attachment{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public name: string = '',
        public type: string = '',
        public fileext: string = '',
        public data: string = '',
        public metadata: any = {}
    ) {}

    setAttachment(name: string, type: string, fileext: string, data: string, metadata: any){
        this.name = name;
        this.type = type;
        this.fileext = fileext;
        this.data = data;
        this.metadata = metadata;
    }

    getAttachment(){
        return {
            name: this.name,
            type: this.type,
            fileext: this.fileext,
            data: this.data,
            metadata: this.metadata
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

    getAttachmentMetadata(){
        return this.metadata;
    }
}