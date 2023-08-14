class UITheme{
    constructor(
        public _id: string = (new Date().getTime()).toString(),
        public name: string = '',
        public themeExample: string = '',
        public themeRoot: string = '',
        public themeAccent: string = '',
        public themeItalic: string = '',
        public themeTextHover: string = '',
        public themeText: string = '',
        public themeBox: string = '',
        public themeButton: string = '',
        public themeBorder: string = '',
        public themeHoverPos: string = '',
        public themeHoverNeg: string = '',
        public themeBlur: string = '',
        public themeBorderWidth: string = '',
        public themeBorderRadius: string = '',
        public themeFont: string = '',
        public themeBorderType: string = '',
        public themeBackground: string = '',
        public author: string = '',
    ) {}

    setName(name: string) {
        this.name = name;
    }

    setThemeExample(themeExample: string) {
        this.themeExample = themeExample;
    }
    
    setThemeRoot(themeRoot: string) {
        this.themeRoot = themeRoot;
    }

    setThemeItalic(themeItalic: string) {
        this.themeItalic = themeItalic;
    }

    setThemeTextHover(themeTextHover: string) {
        this.themeTextHover = themeTextHover;
    }

    setThemeText(themeText: string) {
        this.themeText = themeText;
    }

    setThemeBox(themeBox: string) {
        this.themeBox = themeBox;
    }

    setThemeBorder(themeBorder: string) {
        this.themeBorder = themeBorder;
    }

    setThemeHoverPos(themeHoverPos: string) {
        this.themeHoverPos = themeHoverPos;
    }

    setThemeHoverNeg(themeHoverNeg: string) {
        this.themeHoverNeg = themeHoverNeg;
    }

    setThemeBlur(themeBlur: string) {
        this.themeBlur = themeBlur;
    }

    setThemeBorderWidth(themeBorderWidth: string) {
        this.themeBorderWidth = themeBorderWidth;
    }

    setThemeBorderRadius(themeBorderRadius: string) {
        this.themeBorderRadius = themeBorderRadius;
    }

    setThemeFont(themeFont: string) {
        this.themeFont = themeFont;
    }

    setThemeBorderType(themeBorderType: string) {
        this.themeBorderType = themeBorderType;
    }

    setAuthor(author: string) {
        this.author = author;
    }

    setThemeBackground(themeBackground: string) {
        this.themeBackground = themeBackground;
    }

    setThemeAccent(themeAccent: string) {
        this.themeAccent = themeAccent;
    }

    setThemeButton(themeButton: string) {
        this.themeButton = themeButton;
    }
}
export default UITheme;