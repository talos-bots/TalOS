import { useState, useEffect } from "react";

interface Props {
    needsReload: boolean;
    setNeedsReload: (reload: boolean) => void;
    setMenuTheme: (theme: any) => void;
}

const MenuThemeLoader = (props: Props) => {
    const theme = props.settings.uiTheme;
    const [uiTheme, setUiTheme] = useState<UITheme>();
    const [themeLoaded, setThemeLoaded] = useState(false);

    useEffect(() => {
        const getThemes = async () => {
            try {
                const loadedTheme = await getUITheme(theme);
                setUiTheme(loadedTheme);
                setThemeLoaded(true);
            } catch (error) {
                console.error(error);
            }              
        }
        getThemes();
    }, [props.settings.uiTheme !== null, props.settings.uiTheme !== undefined]);

    useEffect(() => {
        if(uiTheme !== undefined) {
            if(uiTheme.themeRoot.length > 0) {
                setStyle(kebabCase('themeRoot'), uiTheme.themeRoot);
            }
            if(uiTheme.themeItalic.length > 0) {
                setStyle(kebabCase('themeItalic'), uiTheme.themeItalic);
            }
            if(uiTheme.themeTextHover.length > 0) {
                setStyle(kebabCase('themeTextHover'), uiTheme.themeTextHover);
            }
            if(uiTheme.themeText.length > 0) {
                setStyle(kebabCase('themeText'), uiTheme.themeText);
            }
            if(uiTheme.themeBox.length > 0) {
                setStyle(kebabCase('themeBox'), uiTheme.themeBox);
            }
            if(uiTheme.themeBorder.length > 0) {
                setStyle(kebabCase('themeBorder'), uiTheme.themeBorder);
            }
            if(uiTheme.themeHoverPos.length > 0) {
                setStyle(kebabCase('themeHoverPos'), uiTheme.themeHoverPos);
            }
            if(uiTheme.themeHoverNeg.length > 0) {
                setStyle(kebabCase('themeHoverNeg'), uiTheme.themeHoverNeg);
            }
            if(uiTheme.themeBlur.length > 0) {
                setStyle(kebabCase('themeBlur'), uiTheme.themeBlur);
            }
            if(uiTheme.themeBorderWidth.length > 0) {
                setStyle(kebabCase('themeBorderWidth'), uiTheme.themeBorderWidth);
            }
            if(uiTheme.themeBorderRadius.length > 0) {
                setStyle(kebabCase('themeBorderRadius'), uiTheme.themeBorderRadius);
            }
            if(uiTheme.themeFont.length > 0) {
                setStyle(kebabCase('themeFont'), uiTheme.themeFont);
            }
            if(uiTheme.themeBorderType.length > 0) {
                setStyle(kebabCase('themeBorderType'), uiTheme.themeBorderType);
            }
            props.setMenuTheme(props.settings.menuTheme);
            props.setNeedsReload(false);
        }
    }, [themeLoaded === true]);

    return null;
}

function kebabCase(str: string) {
    return '--' + str
        .replace(/([A-Z])/g, '-$1') // add a hyphen before each capital letter
        .replace(/\s+$/, '') // remove trailing spaces
        .toLowerCase(); // make everything lowercase
}

function setStyle(styleName: string, styleValue: string) {
    document.documentElement.style.setProperty(styleName, styleValue);
}

export default MenuThemeLoader;