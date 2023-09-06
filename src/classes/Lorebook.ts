export class Lorebook {
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public name: string = '',
        public avatar: string = '',
        public description: string = '',
        public scan_depth: number = 0,
        public token_budget: number = 0,
        public recursive_scanning: boolean = false,
        public global: boolean = false,
        public constructs: string[] = [],
        public extensions: Record<string, any> = {},
        public entries: LoreEntry[] = [],
    ) {}

    setName(name: string) {
        this.name = name;
    }

    getName(){
        return this.name;
    }

    setDescription(description: string) {
        this.description = description;
    }

    getDescription(){
        return this.description;
    }

    setScanDepth(scan_depth: number) {
        this.scan_depth = scan_depth;
    }

    getScanDepth(){
        return this.scan_depth;
    }

    setTokenBudget(token_budget: number) {
        this.token_budget = token_budget;
    }

    getTokenBudget(){
        return this.token_budget;
    }

    setRecursiveScanning(recursive_scanning: boolean) {
        this.recursive_scanning = recursive_scanning;
    }

    getRecursiveScanning(){
        return this.recursive_scanning;
    }

    setExtensions(extensions: Record<string, any>) {
        this.extensions = extensions;
    }

    getExtensions(){
        return this.extensions;
    }

    setEntries(entries: LoreEntry[]) {
        this.entries = entries;
    }

    getEntries(){
        return this.entries;
    }

    addEntry(entry: LoreEntry){
        this.entries.push(entry);
    }

    removeEntry(entry: LoreEntry){
        this.entries.splice(this.entries.indexOf(entry), 1);
    }

    getEntryById(id: string){
        return this.entries.find((entry) => entry._id === id);
    }

    getEntryByIndex(index: number){
        return this.entries[index];
    }

    getEntryIndex(entry: LoreEntry){
        return this.entries.indexOf(entry);
    }

    setEntryIndex(entry: LoreEntry, index: number){
        this.entries.splice(this.entries.indexOf(entry), 1);
        this.entries.splice(index, 0, entry);
    }

    moveEntryUp(entry: LoreEntry){
        const index = this.entries.indexOf(entry);
        if(index > 0){
            this.setEntryIndex(entry, index - 1);
        }
    }

    moveEntryDown(entry: LoreEntry){
        const index = this.entries.indexOf(entry);
        if(index < this.entries.length - 1){
            this.setEntryIndex(entry, index + 1);
        }
    }

    moveEntryToTop(entry: LoreEntry){
        this.setEntryIndex(entry, 0);
    }

    moveEntryToBottom(entry: LoreEntry){
        this.setEntryIndex(entry, this.entries.length - 1);
    }
}
export type EntryPostion = 'before_char' | 'after_char';
export class LoreEntry {
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public keys: string[] = [],
        public content: string = '',
        public extensions: Record<string, any> = {},
        public enabled: boolean = true,
        public case_sensitive: boolean = false,
        public name: string = '',
        public priority: number = 0,
        public comment: string = '',
        public selective: boolean = false,
        public secondary_keys: string[] = [],
        public constant: boolean = false,
        public position: EntryPostion = 'before_char',
    ) {}

    addKey(key: string) {
        this.keys.push(key);
    }

    removeKey(key: string) {
        this.keys.splice(this.keys.indexOf(key), 1);
    }

    addSecondaryKey(key: string) {
        this.secondary_keys.push(key);
    }

    removeSecondaryKey(key: string) {
        this.secondary_keys.splice(this.secondary_keys.indexOf(key), 1);
    }

    setKeys(keys: string[]) {
        this.keys = keys;
    }

    getKeys() {
        return this.keys;
    }

    setContent(content: string) {
        this.content = content;
    }

    getContent() {
        return this.content;
    }

    setExtensions(extensions: Record<string, any>) {
        this.extensions = extensions;
    }

    getExtensions() {
        return this.extensions;
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    getEnabled() {
        return this.enabled;
    }

    setCaseSensitive(case_sensitive: boolean) {
        this.case_sensitive = case_sensitive;
    }

    getCaseSensitive() {
        return this.case_sensitive;
    }

    setName(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setPriority(priority: number) {
        this.priority = priority;
    }

    getPriority() {
        return this.priority;
    }

    setComment(comment: string) {
        this.comment = comment;
    }

    getComment() {
        return this.comment;
    }

    setSelective(selective: boolean) {
        this.selective = selective;
    }

    getSelective() {
        return this.selective;
    }

    setSecondaryKeys(secondary_keys: string[]) {
        this.secondary_keys = secondary_keys;
    }

    getSecondaryKeys() {
        return this.secondary_keys;
    }

    setConstant(constant: boolean) {
        this.constant = constant;
    }

    getConstant() {
        return this.constant;
    }

    setPosition(position: 'before_char' | 'after_char') {
        this.position = position;
    }

    getPosition() {
        return this.position;
    }
}