export class User{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public name: string = '',
        public nickname: string = '',
        public pronouns: string = '',
        public avatar: string = '',
        public personality: string = '',
        public background: string = '',
        public relationships: string[] = [],
        public interests: string[] = []
    ) {}

    setUser(name: string, nickname: string, pronouns: string, avatar: string, personality: string, background: string, relationships: string[], interests: string[]){
        this.name = name;
        this.nickname = nickname;
        this.pronouns = pronouns;
        this.avatar = avatar;
        this.personality = personality;
        this.background = background;
        this.relationships = relationships;
        this.interests = interests;
    }

    getUser(){
        return {
            name: this.name,
            nickname: this.nickname,
            pronouns: this.pronouns,
            avatar: this.avatar,
            personality: this.personality,
            background: this.background,
            relationships: this.relationships,
            interests: this.interests
        }
    }

    getUserName(){
        return this.name;
    }

    getUserNickname(){
        return this.nickname;
    }

    getUserAvatar(){
        return this.avatar;
    }

    getUserPersonality(){
        return this.personality;
    }

    getUserBackground(){
        return this.background;
    }

    getUserRelationships(){
        return this.relationships;
    }

    getUserInterests(){
        return this.interests;
    }

    setUserName(name: string){
        this.name = name;
    }

    setUserNickname(nickname: string){
        this.nickname = nickname;
    }

    setUserAvatar(avatar: string){
        this.avatar = avatar;
    }

    setUserPersonality(personality: string){
        this.personality = personality;
    }

    setUserBackground(background: string){
        this.background = background;
    }

    setUserRelationships(relationships: string[]){
        this.relationships = relationships;
    }

    setUserInterests(interests: string[]){
        this.interests = interests;
    }

    addUserRelationship(relationship: string){
        this.relationships.push(relationship);
    }

    addUserInterest(interest: string){
        this.interests.push(interest);
    }

    removeUserRelationship(relationship: string){
        this.relationships = this.relationships.filter((r) => r !== relationship);
    }

    removeUserInterest(interest: string){
        this.interests = this.interests.filter((i) => i !== interest);
    }

    updateUserRelationship(oldRelationship: string, newRelationship: string){
        this.relationships = this.relationships.map((r) => r === oldRelationship ? newRelationship : r);
    }

    updateUserInterest(oldInterest: string, newInterest: string){
        this.interests = this.interests.map((i) => i === oldInterest ? newInterest : i);
    }

    updateUserRelationships(relationships: string[]){
        this.relationships = relationships;
    }   

    updateUserInterests(interests: string[]){
        this.interests = interests;
    }
}