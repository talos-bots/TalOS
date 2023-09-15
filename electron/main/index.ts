import { app, BrowserWindow, shell, ipcMain, dialog } from "electron";
import { release } from "node:os";
import { join } from "node:path";
import path from "path";
import { DiscordJSRoutes } from "./api/discord";
import { PouchDBRoutes } from "./api/pouchdb";
import Store from "electron-store";
import { FsAPIRoutes } from "./api/fsapi";
import { LanguageModelAPI } from "./api/llm";
import { SDRoutes } from "./api/sd";
import constructController from "./controllers/ConstructController";
import fs from "fs";
import DiscordController from "./controllers/DiscordController";
import { ElectronDBRoutes } from "./api/electrondb";
import { LangChainRoutes } from "./api/langchain";
import { VectorDBRoutes } from "./api/vector";
import { getModels } from "./model-pipeline/transformers";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
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
export let isDarwin = process.platform === "darwin";
// export let isDarwin = true;
export let win: BrowserWindow | null = null;
// Here, you can also use other preload
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");
export const modelsPath = join(process.env.VITE_PUBLIC, "models/");
export const wasmPath = join(process.env.VITE_PUBLIC, "wasm/");
export const backgroundsPath = join(process.env.VITE_PUBLIC, "backgrounds/");
export const charactersPath = join(process.env.VITE_PUBLIC, "defaults/characters/");
export const dataPath = path.join(app.getPath("userData"), "data/");
export const imagesPath = path.join(dataPath, "images/");
fs.mkdirSync(dataPath, { recursive: true });
fs.mkdirSync(imagesPath, { recursive: true });
export const store = new Store();
async function createWindow() {
  win = new BrowserWindow({
    title: "ConstructOS - AI Sandbox",
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
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

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  DiscordJSRoutes();
  PouchDBRoutes();
  FsAPIRoutes();
  LanguageModelAPI();
  SDRoutes();
  ElectronDBRoutes();
  constructController();
  DiscordController();
  LangChainRoutes();
  VectorDBRoutes();
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

ipcMain.on("load-models", async (event) => {
  getModels().then((models) => {
    event.sender.send("load-models-reply", true);
  });
});

ipcMain.on('open-external-url', (event, url: string) => {
  shell.openExternal(url);
});

ipcMain.handle("get-data-path", () => {
  return dataPath;
});

ipcMain.on("set-data", (event, arg) => {
  store.set(arg.key, arg.value);
});

ipcMain.on("get-data", (event, arg, replyName) => {
  event.sender.send(replyName, store.get(arg));
});

ipcMain.on('save-background', (event, imageData, name, fileType) => {
  const imagePath = path.join(backgroundsPath, `${name}.${fileType}`);
  const data = Buffer.from(imageData, 'base64');
  fs.writeFileSync(imagePath, data);
  event.sender.send('save-background-reply', `${name}.${fileType}`);
});

ipcMain.on('get-backgrounds', (event) => {
  fs.readdir(backgroundsPath, (err, files) => {
    if (err) {
      event.sender.send('get-backgrounds-reply', []);
      return;
    }
    event.sender.send('get-backgrounds-reply', files);
  });
});

ipcMain.on('delete-background', (event, name) => {
  fs.unlink(path.join(backgroundsPath, name), (err) => {
    if (err) {
      event.sender.send('delete-background-reply', false);
      return;
    }
    event.sender.send('delete-background-reply', true);
  });
});

ipcMain.handle("get-server-port", (event) => {
  try {
    // Using app.getAppPath() to get the root directory of the app
    const appRoot = app.getAppPath();

    // Construct the path to the config file
    const configPath = path.join(appRoot, "backend", "config.json");

    const rawData = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(rawData);
    return config.port;
  } catch (error) {
    console.error("Failed to get server port:", error);
    throw error; // This will send the error back to the renderer
  }
});

ipcMain.on("get-default-characters", (event) => {
  const characters: string[] = [];
  fs.readdirSync(charactersPath).forEach((file) => {
    if(file.endsWith(".png")){
      characters.push(file);
    }
  });
  event.sender.send("get-default-characters-reply", characters);
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
