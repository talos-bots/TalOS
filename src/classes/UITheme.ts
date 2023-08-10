class UITheme{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public name: string = '',
        public themeExample: string = '',
        public themeRoot: string = '',
        public themeItalic: string = '',
        public themeTextHover: string = '',
        public themeText: string = '',
        public themeBox: string = '',
        public themeBorder: string = '',
        public themeHoverPos: string = '',
        public themeHoverNeg: string = '',
        public themeBlur: string = '',
        public themeBorderWidth: string = '',
        public themeBorderRadius: string = '',
        public themeFont: string = '',
        public themeBorderType: string = '',
        public author: string = '',
        public timeCreated: Date = new Date(),
        public lastModified: Date = new Date()
    ) {}

    setName(name: string) {
        this.name = name;
        this.updateLastModified();
    }

    setThemeExample(themeExample: string) {
        this.themeExample = themeExample;
        this.updateLastModified();
    }
    
    setThemeRoot(themeRoot: string) {
        this.themeRoot = themeRoot;
        this.updateLastModified();
    }

    setThemeItalic(themeItalic: string) {
        this.themeItalic = themeItalic;
        this.updateLastModified();
    }

    setThemeTextHover(themeTextHover: string) {
        this.themeTextHover = themeTextHover;
        this.updateLastModified();
    }

    setThemeText(themeText: string) {
        this.themeText = themeText;
        this.updateLastModified();
    }

    setThemeBox(themeBox: string) {
        this.themeBox = themeBox;
        this.updateLastModified();
    }

    setThemeBorder(themeBorder: string) {
        this.themeBorder = themeBorder;
        this.updateLastModified();
    }

    setThemeHoverPos(themeHoverPos: string) {
        this.themeHoverPos = themeHoverPos;
        this.updateLastModified();
    }

    setThemeHoverNeg(themeHoverNeg: string) {
        this.themeHoverNeg = themeHoverNeg;
        this.updateLastModified();
    }

    setThemeBlur(themeBlur: string) {
        this.themeBlur = themeBlur;
        this.updateLastModified();
    }

    setThemeBorderWidth(themeBorderWidth: string) {
        this.themeBorderWidth = themeBorderWidth;
        this.updateLastModified();
    }

    setThemeBorderRadius(themeBorderRadius: string) {
        this.themeBorderRadius = themeBorderRadius;
        this.updateLastModified();
    }

    setThemeFont(themeFont: string) {
        this.themeFont = themeFont;
        this.updateLastModified();
    }

    setThemeBorderType(themeBorderType: string) {
        this.themeBorderType = themeBorderType;
        this.updateLastModified();
    }

    setAuthor(author: string) {
        this.author = author;
        this.updateLastModified();
    }

    private updateLastModified() {
        this.lastModified = new Date();
    }
}
export default UITheme;