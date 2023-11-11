import { app, BrowserWindow, shell, ipcMain, dialog, session } from "electron";
import { release } from "node:os";
import path, { join } from "node:path";
import fs from "fs";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import './server.js';
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
// export let isDarwin = true;
export let win: BrowserWindow | null = null;
// Here, you can also use other preload
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");
async function createWindow() {
  win = new BrowserWindow({
    title: "TalOS - AI Sandbox",
    icon: join(process.env.VITE_PUBLIC, "talos-icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      spellcheck: true,
    },
    fullscreenable: true,
    frame: true,
    transparent: false,
    autoHideMenuBar: true,
    resizable: true,
    maximizable: true,
    minimizable: true,
  });

  win.maximize();
  await requestFullDiskAccess();
  if (url) {
    win.loadURL(url);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    if (details.url.includes('http://localhost:3003')) {
      callback({ cancel: false });
    } else if (details.url.includes('file:///C:/') && details.url.includes('http://localhost:3003')) {
      // Modify the URL as needed
      callback({ redirectURL: details.url.replace(process.env.DIST, '') });
    } else {
      callback({ cancel: false });
    }
  });
  
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.session.setSpellCheckerLanguages(['en-US'])

  const { Menu, MenuItem } = require('electron')

  win.webContents.on('context-menu', (event, params) => {
    const menu = new Menu()
    if(win !== null){
    // Add each spelling suggestion
    for (const suggestion of params.dictionarySuggestions) {
      menu.append(new MenuItem({
        label: suggestion,
        //@ts-ignore
        click: () => win.webContents.replaceMisspelling(suggestion)
      }))
    }

    // Allow users to add the misspelled word to the dictionary
    if (params.misspelledWord) {
      menu.append(
        new MenuItem({
          label: 'Add to dictionary',
          //@ts-ignore
          click: () => win.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
        })
      )
    }

    menu.popup()
    }
  })
  // update(win)
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow().then(() => {
      console.log("Window created");
    });
  }
});

app.on("ready", () => {
  const { session } = require("electron");
  session.defaultSession.clearCache();
});
// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

ipcMain.on('open-external-url', (event, url: string) => {
  shell.openExternal(url);
});

async function requestFullDiskAccess() {
  if (process.platform === 'darwin') {
    // Try to read a directory that requires Full Disk Access
    try {
      fs.readdirSync('/Library/Application Support/com.apple.TCC');
    } catch (e) {
      // Reading the directory failed, which likely means that Full Disk Access
      // has not been granted. Show the dialog that prompts the user to grant access.
      const { response } = await dialog.showMessageBox({
        type: 'info',
        title: 'Full Disk Access Required',
        message: 'This application requires full disk access to function properly.',
        detail: 'Please enable full disk access for this application in System Preferences.',
        buttons: ['Open System Preferences', 'Cancel'],
        defaultId: 0,
        cancelId: 1
      });

      if (response === 0) {
        shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles');
      }
    }
  }
}