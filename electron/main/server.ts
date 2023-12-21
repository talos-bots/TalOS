import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

const appDataPath = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences/' : '/var/local/');
import DiscordController from "./controllers/DiscordController.js";
import { ElectronDBRoutes } from "./api/electrondb.js";
import { VectorDBRoutes } from "./api/vector.js";
import { getModels } from "./model-pipeline/transformers.js";
import express, { Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';
import { createServer } from "node:http";
import { LanguageModelAPI } from "./api/llm.js";
import { SDRoutes } from "./api/sd.js";
import constructController from "./controllers/ChatController.js";
import { DiscordJSRoutes } from "./api/discord.js";
import { PouchDBRoutes } from "./api/pouchdb.js";
import path, { join } from "node:path";
import fs from "fs";
import { ActiveConstructController } from "./controllers/ActiveConstructController.js";
import Store from "electron-store";
export const store = new Store();
export const modelsPath = path.join(process.env.VITE_PUBLIC, "models/");
export const wasmPath = path.join(process.env.VITE_PUBLIC, "wasm/");
export const backgroundsPath = path.join(process.env.VITE_PUBLIC, "backgrounds/");
export const charactersPath = path.join(process.env.VITE_PUBLIC, "defaults/characters/");
export const dataPath = path.join(appDataPath,"ConstructOS/data/");
console.log(dataPath);
export const imagesPath = path.join(dataPath, "images/");
export const uploadsPath = path.join(dataPath, "uploads/");
export const actionLogsPath = path.join(dataPath, "action-logs/");
export const eventLogsPath = path.join(dataPath, "event-logs/");
fs.mkdirSync(dataPath, { recursive: true });
fs.mkdirSync(imagesPath, { recursive: true });
fs.mkdirSync(uploadsPath, { recursive: true });
fs.mkdirSync(actionLogsPath, { recursive: true });
export let isDarwin = process.platform === "darwin";

export const expressApp = express();
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
const port = 3003;

expressApp.use(express.static('public'));
expressApp.use(express.static('dist'));
expressApp.use(bodyParser.json({ limit: '1000mb' }));
expressApp.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }));
const corsOptions = {
  origin: "*", // Accepts all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // List all methods you want to allow
  credentials: true // Optional: if you need to handle credentials
};
expressApp.use(cors(corsOptions));
expressApp.use('/api/images', express.static(uploadsPath));
const server = createServer(expressApp);
export const expressAppIO = new Server(server, {
  cors: corsOptions
});

//enable * on CORS for socket.io
expressAppIO.sockets.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Logging all events
  socket.onAny((eventName, ...args) => {
     console.log(`event: ${eventName}`, args);
  });
});

server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

expressApp.post("/api/models/load", async (req, res) => {
  getModels().then(() => {
    res.send(true);
  }).catch((err) => {
    res.send(err);
  });
});

expressApp.get('/api/get-data-path', (req, res) => {
  res.send({ dataPath: dataPath });
});

// Route to set data
expressApp.post('/api/set-data', (req, res) => {
  const { key, value } = req.body;
  store.set(key, value);
  res.send({ status: 'success' });
});

// Route to get data
expressApp.get('/api/get-data/:key', (req, res) => {
  const value = store.get(req.params.key);
  res.send({ value: value });
});

// Route to save a background
expressApp.post('/api/save-background', (req, res) => {
  const { imageData, name, fileType } = req.body;
  const imagePath = path.join(backgroundsPath, `${name}.${fileType}`);
  const data = Buffer.from(imageData, 'base64');
  fs.writeFileSync(imagePath, data);
  res.send({ fileName: `${name}.${fileType}` });
});

// Route to get backgrounds
expressApp.get('/api/get-backgrounds', (req, res) => {
  fs.readdir(backgroundsPath, (err, files) => {
    if (err) {
      res.send({ files: [] });
      return;
    }
    res.send({ files: files });
  });
});

// Route to delete a background
expressApp.delete('/api/delete-background/:name', (req, res) => {
  fs.unlink(path.join(backgroundsPath, req.params.name), (err) => {
    if (err) {
      res.send({ success: false });
      return;
    }
    res.send({ success: true });
  });
});

// Route to get default characters
expressApp.get('/api/get-default-characters', (req, res) => {
  const characters: any[] = [];
  
  try {
    fs.readdirSync(charactersPath).forEach((file) => {
      if (file.endsWith(".png")) {
        characters.push(file);
      }
    });
    res.send({ characters: characters });
  } catch (err) {
    res.status(500).send({ error: 'Failed to read the characters directory.' });
  }
});

expressApp.post('/api/images/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded: ${req.file.originalname}`);
});

DiscordJSRoutes();
PouchDBRoutes();
LanguageModelAPI();
SDRoutes();
ElectronDBRoutes();
constructController();
DiscordController();
VectorDBRoutes();
ActiveConstructController();