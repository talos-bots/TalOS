import { getStorageValue } from "@/api/dbapi";
import UITheme from "@/classes/UITheme";
import { defaultThemes } from "@/constants/uithemes";
import { useState, useEffect } from "react";

interface Props {
    needsReload: boolean;
    setNeedsReload: (reload: boolean) => void;
}

const MenuThemeLoader = (props: Props) => {
    const [uiTheme, setUiTheme] = useState<UITheme>();
    const [themeLoaded, setThemeLoaded] = useState(false);
    const [background, setBackground] = useState<string | null>(null);
    useEffect(() => {
        let savedTheme: string | undefined;
        const getBackground = async () => {
            const data = await getStorageValue('background');
            if(data !== null) {
                setStyle('background-image', `url(./backgrounds/${data})`);
                setBackground(data);
            }
        }
        getBackground();
        const getSavedTheme = async () => {
            try {
                savedTheme = await getStorageValue('uiTheme');
                console.log(savedTheme);
            }catch(err) {
                console.log(err);
            }
            getThemes();
        }
        const getThemes = async () => {
            let loadedTheme: UITheme = defaultThemes[0];
            if(savedTheme !== undefined) {
                loadedTheme = defaultThemes.find((theme) => theme._id === savedTheme) || defaultThemes[0];
            }
            setUiTheme(loadedTheme);
            setThemeLoaded(true);            
        }
        getSavedTheme();
    }, []);    

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
            if(uiTheme.themeBackground.length > 0) {
                if(background !== null) {
                    setStyle('background-image', `url(./backgrounds/${background})`);
                }else{
                    setStyle('background-image', `url(./backgrounds/${uiTheme.themeBackground})`);
                }
            }
            if(uiTheme.themeAccent.length > 0) {
                setStyle(kebabCase('themeAccent'), uiTheme.themeAccent);
            }
            if(uiTheme.themeButton.length > 0) {
                setStyle(kebabCase('themeButton'), uiTheme.themeButton);
            }
            if(uiTheme.ThemeBrightColor.length > 0) {
                setStyle(kebabCase('themeBrightColor'), uiTheme.ThemeBrightColor);
            }
            if(uiTheme.themeFlavorText.length > 0) {
                setStyle(kebabCase('themeFlavorText'), uiTheme.themeFlavorText);
            }
            if(uiTheme.themeBackgroundColor.length > 0 && uiTheme.themeBackgroundColor !== 'null') {
                setStyle('background-color', uiTheme.themeBackgroundColor);
                setStyle('background-image', 'none');
            }
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

export function setStyle(styleName: string, styleValue: string) {
    document.documentElement.style.setProperty(styleName, styleValue);
}

export default MenuThemeLoader;