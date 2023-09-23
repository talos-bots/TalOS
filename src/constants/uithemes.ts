import UITheme from "@/classes/UITheme";

const defaultGreen = new UITheme();
defaultGreen.name = 'Green';
defaultGreen._id = "DefaultGreen";
defaultGreen.themeRoot = 'rgba(0, 59, 15, 0.5)';
defaultGreen.themeItalic = 'rgb(197, 196, 196)';
defaultGreen.themeText = 'rgba(255, 253, 253, 1)';
defaultGreen.themeBox = '#156800';
defaultGreen.themeAccent = 'rgba(12, 151, 31, 0.295)';
defaultGreen.themeBorder = 'rgba(0, 0, 0, 1)';
defaultGreen.themeHoverPos = 'var(--theme-accent)';
defaultGreen.themeHoverNeg = 'rgba(196, 0, 0, .75)';
defaultGreen.themeBlur = '15px';
defaultGreen.themeBorderWidth = '2px';
defaultGreen.themeBorderRadius = '8px';
defaultGreen.themeFont = "'DejaVuSansBold', sans-serif";
defaultGreen.themeBorderType = 'solid';
defaultGreen.themeTextHover = 'rgb(255, 255, 255)';
defaultGreen.themeBackground = "url('./backgrounds/greendefault.svg')";
defaultGreen.themeButton = 'rgba(14, 34, 19, 0.658)';
defaultGreen.ThemeBrightColor = 'rgba(0, 255, 26, 0.25)'
defaultGreen.themeFlavorText = 'rgba(0, 255, 13, 0.5)';

const defaultBlue = new UITheme();
defaultBlue.name = 'Blue';
defaultBlue._id = 'DefaultBlue';
defaultBlue.themeRoot = 'rgba(0, 19, 59, 0.5)';
defaultBlue.themeItalic = 'rgb(197, 196, 196)';
defaultBlue.themeText = 'rgba(255, 253, 253, 1)';
defaultBlue.themeBox = 'rgba(8, 57, 131, 0.767)';
defaultBlue.themeAccent = 'rgba(12, 78, 150, 0.295)';
defaultBlue.themeBorder = 'rgba(0, 0, 0, 1)';
defaultBlue.themeHoverPos = 'var(--theme-accent)';
defaultBlue.themeHoverNeg = 'rgba(196, 0, 0, .75)';
defaultBlue.themeBlur = '15px';
defaultBlue.themeBorderWidth = '2px';
defaultBlue.themeBorderRadius = '8px';
defaultBlue.themeFont = "'DejaVuSansBold', sans-serif";
defaultBlue.themeBorderType = 'solid';
defaultBlue.themeTextHover = 'rgb(255, 255, 255)';
defaultBlue.themeBackground = "url('./backgrounds/bluedefault.svg";
defaultBlue.themeButton = 'rgba(14, 18, 33, 0.658)';
defaultBlue.ThemeBrightColor = 'rgba(0, 30, 52)';
defaultBlue.themeFlavorText = 'rgba(0, 162, 255, 0.5)';

const defaultRed = new UITheme();
defaultRed.name = 'Red';
defaultRed._id = 'DefaultRed';
defaultRed.themeRoot = 'rgba(59, 0, 0, 0.5)';
defaultRed.themeItalic = 'rgb(197, 196, 196)';
defaultRed.themeText = 'rgba(255, 253, 253, 1)';
defaultRed.themeBox = 'rgba(131, 8, 21, 0.767)';
defaultRed.themeAccent = 'rgba(150, 12, 30, 0.295)';
defaultRed.themeBorder = 'rgba(0, 0, 0, 1)';
defaultRed.themeHoverPos = 'var(--theme-accent)';
defaultRed.themeHoverNeg = 'rgba(196, 0, 0, .75)';
defaultRed.themeBlur = '15px';
defaultRed.themeBorderWidth = '2px';
defaultRed.themeBorderRadius = '8px';
defaultRed.themeFont = "'DejaVuSansBold', sans-serif";
defaultRed.themeBorderType = 'solid';
defaultRed.themeTextHover = 'rgb(255, 255, 255)';
defaultRed.themeBackground = "url('./backgrounds/reddefault.svg')"; // Changed the background to a hypothetical 'reddefault.svg'
defaultRed.themeButton = 'rgba(33, 18, 14, 0.658)';
defaultRed.ThemeBrightColor = 'rgba(52, 0, 10)';
defaultRed.themeFlavorText = 'rgba(255, 0, 30, 0.5)';

const defaultPurple = new UITheme();
defaultPurple.name = 'Purple';
defaultPurple._id = 'DefaultPurple';
defaultPurple.themeRoot = 'rgba(50, 0, 50, 0.5)';
defaultPurple.themeItalic = 'rgb(197, 176, 196)';
defaultPurple.themeText = 'rgba(255, 253, 253, 1)';
defaultPurple.themeBox = 'rgba(79, 16, 124, 0.767)';
defaultPurple.themeAccent = 'rgba(69, 12, 95, 0.295)';
defaultPurple.themeBorder = 'rgba(0, 0, 0, 1)';
defaultPurple.themeHoverPos = 'var(--theme-accent)';
defaultPurple.themeHoverNeg = 'rgba(196, 0, 70, .75)';
defaultPurple.themeBlur = '15px';
defaultPurple.themeBorderWidth = '2px';
defaultPurple.themeBorderRadius = '8px';
defaultPurple.themeFont = "'DejaVuSansBold', sans-serif";
defaultPurple.themeBorderType = 'solid';
defaultPurple.themeTextHover = 'rgb(255, 230, 255)';
defaultPurple.themeBackground = "url('./backgrounds/purpledefault.svg')";
defaultPurple.themeButton = 'rgba(100, 0, 143, 0.808)';
defaultPurple.ThemeBrightColor = 'rgba(20, 0, 35)';
defaultPurple.themeFlavorText = 'rgb(147, 0, 206)';

const defaultYellow = new UITheme();

defaultYellow.name = 'Mustard';
defaultYellow._id = 'DefaultMustard';
defaultYellow.themeRoot = 'rgba(50, 50, 0, 0.5)';
defaultYellow.themeItalic = 'rgb(197, 196, 196)';
defaultYellow.themeText = 'rgba(255, 253, 253, 1)';
defaultYellow.themeBox = 'rgba(131, 115, 8, 0.767)';
defaultYellow.themeAccent = 'rgba(150, 134, 12, 0.295)';
defaultYellow.themeBorder = 'rgba(0, 0, 0, 1)';
defaultYellow.themeHoverPos = 'var(--theme-accent)';
defaultYellow.themeHoverNeg = 'rgba(196, 110, 0, .75)';
defaultYellow.themeBlur = '15px';
defaultYellow.themeBorderWidth = '2px';
defaultYellow.themeBorderRadius = '8px';
defaultYellow.themeFont = "'DejaVuSansBold', sans-serif";
defaultYellow.themeBorderType = 'solid';
defaultYellow.themeTextHover = 'rgb(255, 255, 180)';
defaultYellow.themeBackground = "url('./backgrounds/yellowdefault.svg')"; // Adjust the file name if needed
defaultYellow.themeButton = 'rgba(33, 30, 14, 0.658)';
defaultYellow.ThemeBrightColor = 'rgba(52, 50, 0)';
defaultYellow.themeFlavorText = 'rgba(255, 162, 0, 0.5)';

const lightMode = new UITheme();
lightMode.name = 'Light Mode';
lightMode._id = 'lightMode';
lightMode.themeRoot = 'rgba(200, 200, 200, 0.5)';
lightMode.themeItalic = 'rgb(197, 196, 196)';
lightMode.themeText = 'rgba(10, 10, 10, 1)';
lightMode.themeBox = 'rgba(220, 220, 220, 0.767)';
lightMode.themeAccent = 'rgba(190, 190, 190, 0.295)';
lightMode.themeBorder = 'rgba(0, 0, 0, 1)';
lightMode.themeHoverPos = 'rgba(180, 180, 180, 0.75)';  // Note: var() isn't used here as themeAccent is light gray now.
lightMode.themeHoverNeg = 'rgba(255, 50, 50, .75)';
lightMode.themeBlur = '15px';
lightMode.themeBorderWidth = '2px';
lightMode.themeBorderRadius = '8px';
lightMode.themeFont = "'DejaVuSansBold', sans-serif";
lightMode.themeBorderType = 'solid';
lightMode.themeTextHover = 'rgb(0, 0, 0)';
lightMode.themeBackground = "url('./backgrounds/home.png')";  // You'd need an appropriate gray background SVG.
lightMode.themeButton = 'rgba(240, 240, 240, 0.658)';
lightMode.ThemeBrightColor = 'rgba(230, 230, 230)';
lightMode.themeFlavorText = 'rgba(80, 80, 80, 0.5)';

const defaultOrange = new UITheme();
defaultOrange.name = 'Orange';
defaultOrange._id = 'DefaultOrange';
defaultOrange.themeRoot = 'rgba(59, 19, 0, 0.5)';
defaultOrange.themeItalic = 'rgb(197, 196, 196)';
defaultOrange.themeText = 'rgba(255, 253, 253, 1)';
defaultOrange.themeBox = 'rgba(131, 57, 8, 0.767)';
defaultOrange.themeAccent = 'rgba(150, 78, 12, 0.295)';
defaultOrange.themeBorder = 'rgba(0, 0, 0, 1)';
defaultOrange.themeHoverPos = 'var(--theme-accent)';
defaultOrange.themeHoverNeg = 'rgba(196, 0, 0, .75)';
defaultOrange.themeBlur = '15px';
defaultOrange.themeBorderWidth = '2px';
defaultOrange.themeBorderRadius = '8px';
defaultOrange.themeFont = "'DejaVuSansBold', sans-serif";
defaultOrange.themeBorderType = 'solid';
defaultOrange.themeTextHover = 'rgb(255, 255, 255)';
defaultOrange.themeBackground = "url('./backgrounds/orangedefault.svg')";
defaultOrange.themeButton = 'rgba(33, 18, 14, 0.658)';
defaultOrange.ThemeBrightColor = 'rgba(52, 30, 0)';
defaultOrange.themeFlavorText = 'rgba(255, 162, 0, 0.5)';

const darkMode = new UITheme();

darkMode.name = 'Dark Mode';
darkMode._id = 'darkMode';
darkMode.themeRoot = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black
darkMode.themeItalic = 'rgb(197, 196, 196)'; // Same as your light gray
darkMode.themeText = 'rgba(255, 253, 253, 1)'; // Almost white for contrast
darkMode.themeBox = 'rgba(30, 30, 30, 0.767)'; // Dark gray box
darkMode.themeAccent = 'rgba(60, 60, 60, 0.295)'; // Slightly lighter gray for accent
darkMode.themeBorder = 'rgba(0, 0, 0, 1)'; // Full black border
darkMode.themeHoverPos = 'var(--theme-accent)'; // Uses the same accent for hover
darkMode.themeHoverNeg = 'rgba(196, 0, 0, .75)'; // Preserving the red for negative hover
darkMode.themeBlur = '15px';
darkMode.themeBorderWidth = '2px';
darkMode.themeBorderRadius = '8px';
darkMode.themeFont = "'DejaVuSansBold', sans-serif";
darkMode.themeBorderType = 'solid';
darkMode.themeTextHover = 'rgb(255, 255, 255, 1)'; // White for hover
darkMode.themeBackground = "url('./backgrounds/homedark.png')"; // Assuming you have a black variant of the background
darkMode.themeButton = 'rgba(40, 40, 40, 0.658)'; // Slightly lighter gray for buttons
darkMode.ThemeBrightColor = 'rgba(50, 50, 50)'; // For brighter elements
darkMode.themeFlavorText = 'rgba(180, 180, 180, 0.5)'; // Light gray for flavor text

const tronMode = new UITheme();
tronMode.name = 'Tron Mode';
tronMode._id = 'tronMode';
tronMode.themeRoot = 'rgba(0, 0, 0, 1)';
tronMode.themeItalic = 'rgb(197, 196, 196)';
tronMode.themeText = 'rgba(255, 253, 253, 1)';
tronMode.themeBox = 'rgba(40, 40, 40, 0.658)';
tronMode.themeAccent = 'rgba(0, 0, 1, 1)';
tronMode.themeBorder = 'rgba(255,255,255, 1)';
tronMode.themeHoverPos = 'rgba(170, 242, 255, 0.77)';
tronMode.themeBackgroundColor = 'rgba(0, 0, 0, 1)';
tronMode.themeHoverNeg = 'rgba(250, 148, 0, 0.77)';
tronMode.themeBlur = '';
tronMode.themeBorderWidth = '2px';
tronMode.themeBorderRadius = '4px';
tronMode.themeFont = "'DejaVuSansBold', sans-serif";
tronMode.themeBorderType = 'solid';
tronMode.themeTextHover = 'rgb(255, 255, 255)';
tronMode.themeButton = 'rgba(40, 40, 40, 0.658)'
tronMode.ThemeBrightColor = 'rgba(170, 242, 255, 0.77)';
tronMode.themeFlavorText = 'rgba(170, 242, 255, 0.77)';


const solidGreen = new UITheme();
solidGreen.name = 'Solid Green';
solidGreen._id = "SolidGreen";
solidGreen.themeRoot = 'rgba(0, 59, 15, 0.5)';
solidGreen.themeItalic = 'rgb(197, 196, 196)';
solidGreen.themeText = 'rgba(255, 253, 253, 1)';
solidGreen.themeBox = '#156800';
solidGreen.themeAccent = 'rgba(12, 151, 31, 1)';
solidGreen.themeBorder = 'rgba(0, 0, 0, 1)';
solidGreen.themeHoverPos = 'var(--theme-accent)';
solidGreen.themeHoverNeg = 'rgba(196, 0, 0, 1)';
solidGreen.themeBlur = '15px';
solidGreen.themeBorderWidth = '0px';
solidGreen.themeBorderRadius = '8px';
solidGreen.themeFont = "'DejaVuSansBold', sans-serif";
solidGreen.themeBorderType = 'solid';
solidGreen.themeTextHover = 'rgb(255, 255, 255)';
solidGreen.themeBackground = "url('./backgrounds/greendefault.svg')";
solidGreen.themeButton = 'rgba(14, 34, 19, 1)';
solidGreen.ThemeBrightColor = 'rgba(0, 255, 26, 1)'
solidGreen.themeFlavorText = 'rgba(0, 255, 13, 1)';

const solidBlue = new UITheme();
solidBlue.name = 'Solid Blue';
solidBlue._id = 'SolidBlue';
solidBlue.themeRoot = 'rgba(0, 19, 59, 0.5)';
solidBlue.themeItalic = 'rgb(197, 196, 196)';
solidBlue.themeText = 'rgba(255, 253, 253, 1)';
solidBlue.themeBox = 'rgba(8, 57, 131, 0.767)';
solidBlue.themeAccent = 'rgba(12, 78, 150, 1)';
solidBlue.themeBorder = 'rgba(0, 0, 0, 1)';
solidBlue.themeHoverPos = 'var(--theme-accent)';
solidBlue.themeHoverNeg = 'rgba(196, 0, 0, 1)';
solidBlue.themeBlur = '15px';
solidBlue.themeBorderWidth = '0px';
solidBlue.themeBorderRadius = '8px';
solidBlue.themeFont = "'DejaVuSansBold', sans-serif";
solidBlue.themeBorderType = 'solid';
solidBlue.themeTextHover = 'rgb(255, 255, 255)';
solidBlue.themeBackground = "url('./backgrounds/bluedefault.svg";
solidBlue.themeButton = 'rgba(14, 18, 33, 1)';
solidBlue.ThemeBrightColor = 'rgba(0, 30, 52)';
solidBlue.themeFlavorText = 'rgba(0, 162, 255, 1)';

const solidRed = new UITheme();
solidRed.name = 'Solid Red';
solidRed._id = 'SolidRed';
solidRed.themeRoot = 'rgba(59, 0, 0, 0.5)';
solidRed.themeItalic = 'rgb(197, 196, 196)';
solidRed.themeText = 'rgba(255, 253, 253, 1)';
solidRed.themeBox = 'rgba(131, 8, 21, 1)';
solidRed.themeAccent = 'rgba(150, 12, 30, 1)';
solidRed.themeBorder = 'rgba(0, 0, 0, 1)';
solidRed.themeHoverPos = 'var(--theme-accent)';
solidRed.themeHoverNeg = 'rgba(196, 0, 0, .75)';
solidRed.themeBlur = '15px';
solidRed.themeBorderWidth = '0px';
solidRed.themeBorderRadius = '8px';
solidRed.themeFont = "'DejaVuSansBold', sans-serif";
solidRed.themeBorderType = 'solid';
solidRed.themeTextHover = 'rgb(255, 255, 255)';
solidRed.themeBackground = "url('./backgrounds/reddefault.svg')"; // Changed the background to a hypothetical 'reddefault.svg'
solidRed.themeButton = 'rgba(33, 18, 14, 1)';
solidRed.ThemeBrightColor = 'rgba(52, 0, 10)';
solidRed.themeFlavorText = 'rgba(255, 0, 30, 1)';

const solidPurple = new UITheme();
solidPurple.name = 'Solid Purple';
solidPurple._id = 'SolidPurple';
solidPurple.themeRoot = 'rgba(50, 0, 50, 0.5)';
solidPurple.themeItalic = 'rgb(197, 176, 196)';
solidPurple.themeText = 'rgba(255, 253, 253, 1)';
solidPurple.themeBox = 'rgba(79, 16, 124, 1)';
solidPurple.themeAccent = 'rgba(69, 12, 95, 1)';
solidPurple.themeBorder = 'rgba(0, 0, 0, 1)';
solidPurple.themeHoverPos = 'var(--theme-accent)';
solidPurple.themeHoverNeg = 'rgba(196, 0, 70, 1)';
solidPurple.themeBlur = '15px';
solidPurple.themeBorderWidth = '0px';
solidPurple.themeBorderRadius = '8px';
solidPurple.themeFont = "'DejaVuSansBold', sans-serif";
solidPurple.themeBorderType = 'solid';
solidPurple.themeTextHover = 'rgb(255, 230, 255)';
solidPurple.themeBackground = "url('./backgrounds/purpledefault.svg')";
solidPurple.themeButton = 'rgba(100, 0, 143, 1)';
solidPurple.ThemeBrightColor = 'rgba(20, 0, 35)';
solidPurple.themeFlavorText = 'rgb(147, 0, 206)';

const solidYellow = new UITheme();
solidYellow.name = 'Solid Mustard';
solidYellow._id = 'SolidMustard';
solidYellow.themeRoot = 'rgba(50, 50, 0, 0.5)';
solidYellow.themeItalic = 'rgb(197, 196, 196)';
solidYellow.themeText = 'rgba(255, 253, 253, 1)';
solidYellow.themeBox = 'rgba(131, 115, 8, 1)';
solidYellow.themeAccent = 'rgba(150, 134, 12, 1)';
solidYellow.themeBorder = 'rgba(0, 0, 0, 1)';
solidYellow.themeHoverPos = 'var(--theme-accent)';
solidYellow.themeHoverNeg = 'rgba(196, 110, 0, 1)';
solidYellow.themeBlur = '15px';
solidYellow.themeBorderWidth = '0px';
solidYellow.themeBorderRadius = '8px';
solidYellow.themeFont = "'DejaVuSansBold', sans-serif";
solidYellow.themeBorderType = 'solid';
solidYellow.themeTextHover = 'rgb(255, 255, 180)';
solidYellow.themeBackground = "url('./backgrounds/yellowdefault.svg')"; // Adjust the file name if needed
solidYellow.themeButton = 'rgba(33, 30, 14, 1)';
solidYellow.ThemeBrightColor = 'rgba(52, 50, 0)';
solidYellow.themeFlavorText = 'rgba(255, 162, 0, 1)';

const lightModeSolid = new UITheme();
lightModeSolid.name = 'Solid Light Mode';
lightModeSolid._id = 'lightModeSolid';
lightModeSolid.themeRoot = 'rgba(200, 200, 200, 0.5)';
lightModeSolid.themeItalic = 'rgba(10, 2, 2, 1)';
lightModeSolid.themeText = 'rgba(10, 10, 10, 1)';
lightModeSolid.themeBox = 'rgba(220, 220, 220, 1)';
lightModeSolid.themeAccent = 'rgba(190, 190, 190, 1)';
lightModeSolid.themeBorder = 'rgba(0, 0, 0, 1)';
lightModeSolid.themeHoverPos = 'rgba(180, 180, 180, 1)';  // Note: var() isn't used here as themeAccent is light gray now.
lightModeSolid.themeHoverNeg = 'rgba(255, 50, 50, 1)';
lightModeSolid.themeBlur = '15px';
lightModeSolid.themeBorderWidth = '0px';
lightModeSolid.themeBorderRadius = '8px';
lightModeSolid.themeFont = "'DejaVuSansBold', sans-serif";
lightModeSolid.themeBorderType = 'solid';
lightModeSolid.themeTextHover = 'rgb(0, 0, 0)';
lightModeSolid.themeBackground = "url('./backgrounds/home.png')";  // You'd need an appropriate gray background SVG.
lightModeSolid.themeButton = 'rgba(240, 240, 240, 1)';
lightModeSolid.ThemeBrightColor = 'rgba(230, 230, 230)';
lightModeSolid.themeFlavorText = 'rgba(80, 80, 80, 1)';

const solidOrange = new UITheme();
solidOrange.name = 'Solid Orange';
solidOrange._id = 'SolidOrange';
solidOrange.themeRoot = 'rgba(59, 19, 0, 0.5)';
solidOrange.themeItalic = '#aaacad';
solidOrange.themeText = 'rgba(255, 253, 253, 1)';
solidOrange.themeBox = 'rgba(131, 57, 8, 1)';
solidOrange.themeAccent = 'rgba(150, 78, 12, 1)';
solidOrange.themeBorder = 'rgba(0, 0, 0, 1)';
solidOrange.themeHoverPos = 'var(--theme-accent)';
solidOrange.themeHoverNeg = 'rgba(196, 0, 0, 1)';
solidOrange.themeBlur = '15px';
solidOrange.themeBorderWidth = '0px';
solidOrange.themeBorderRadius = '8px';
solidOrange.themeFont = "'DejaVuSansBold', sans-serif";
solidOrange.themeBorderType = 'solid';
solidOrange.themeTextHover = 'rgb(255, 255, 255)';
solidOrange.themeBackground = "url('./backgrounds/orangedefault.svg')";
solidOrange.themeButton = 'rgba(33, 18, 14, 1)';
solidOrange.ThemeBrightColor = 'rgba(52, 30, 0)';
solidOrange.themeFlavorText = 'rgba(255, 162, 0, 1)';

const darkModeSolid = new UITheme();
darkModeSolid.name = 'Solid Dark Mode';
darkModeSolid._id = 'darkModeSolid';
darkModeSolid.themeRoot = 'rgba(0, 0, 0, 0.5)'; 
darkModeSolid.themeItalic = '#aaacad';
darkModeSolid.themeText = 'rgba(255, 253, 253, 1)';
darkModeSolid.themeBox = 'rgba(30, 30, 30, 1)';
darkModeSolid.themeAccent = 'rgba(60, 60, 60, 1)';
darkModeSolid.themeBorder = 'rgba(0, 0, 0, 1)';
darkModeSolid.themeHoverPos = 'var(--theme-accent)'; 
darkModeSolid.themeHoverNeg = 'rgba(196, 0, 0, 1)';
darkModeSolid.themeBlur = '15px';
darkModeSolid.themeBorderWidth = '0px';
darkModeSolid.themeBorderRadius = '8px';
darkModeSolid.themeFont = "'DejaVuSansBold', sans-serif";
darkModeSolid.themeBorderType = 'solid';
darkModeSolid.themeTextHover = 'rgb(255, 255, 255, 1)';
darkModeSolid.themeBackground = "url('./backgrounds/homedark.png')"; 
darkModeSolid.themeButton = 'rgba(40, 40, 40, 1)'; 
darkModeSolid.ThemeBrightColor = 'rgba(50, 50, 50)'; 
darkModeSolid.themeFlavorText = 'rgba(180, 180, 180, 0.5)';

export const defaultThemes: UITheme[] = [
    darkMode,
    darkModeSolid,
    defaultGreen,
    solidGreen,
    defaultBlue,
    solidBlue,
    defaultRed,
    solidRed,
    defaultPurple,
    solidPurple,
    defaultYellow,
    solidYellow,
    lightMode,
    lightModeSolid,
    defaultOrange,
    solidOrange,
    tronMode,
]