import { dataPath, isDarwin } from '../';
import { ipcMain } from 'electron';
import path from 'path';
import { LocalIndex } from 'vectra';
import { MessageInterface } from '../types/types';
import { getEmbedding } from '../model-pipeline/transformers';

export async function getAllVectors(schemaName: string) {
    try {
        const indexPath = path.join(dataPath, schemaName);
        const index = new LocalIndex(indexPath);
        if (!await index.isIndexCreated()) {
            await index.createIndex();
        }
        const vectors = await index.listItems();
        return vectors;
    } catch (error) {
        console.error(error);
        throw new Error('Error in getAllVectors function');
    }
}

export async function getRelaventMemories(schemaName: string, text: string) {
    try {
        const indexPath = path.join(dataPath, schemaName);
        const index = new LocalIndex(indexPath);
        if (!await index.isIndexCreated()) {
            await index.createIndex();
        }
        const vector = await getVector(text);
        const memories = await index.queryItems(vector, 10);
        return memories;
    } catch (error) {
        console.error(error);
        throw new Error('Error in getRelevantMemories function');
    }
}

export async function addVectorFromMessage(schemaName: string, message: MessageInterface) {
    try {
        const indexPath = path.join(dataPath, schemaName);
        const index = new LocalIndex(indexPath);
        if (!await index.isIndexCreated()) {
            await index.createIndex();
        }
        await index.insertItem({
            vector: await getVector(message.text),
            metadata: message
        });
    } catch (error) {
        console.error(error);
        throw new Error('Error in addVectorFromMessage function');
    }
}

export async function getVector(text: string) {
    try {
        return await getEmbedding(text);
    } catch (error) {
        console.error(error);
        throw new Error('Error in getVector function');
    }
}

export async function deleteIndex(schemaName: string) {
    try {
        const indexPath = path.join(dataPath, schemaName);
        const index = new LocalIndex(indexPath);
        if (await index.isIndexCreated()) {
            await index.deleteIndex();
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error in deleteIndex function');
    }
}

export function VectorDBRoutes(){
    ipcMain.on('get-all-vectors', async (event, schemaName: string, uniqueReplyName: string) => {
        getAllVectors(schemaName).then((vectors) => {
            event.reply(uniqueReplyName, vectors);
        }).catch((error) => {
            event.reply(uniqueReplyName, error);
        });
    });

    ipcMain.on('get-relavent-memories', async (event, schemaName: string, text: string, uniqueReplyName: string) => {
        getRelaventMemories(schemaName, text).then((memories) => {
            event.reply(uniqueReplyName, memories);
        }).catch((error) => {
            event.reply(uniqueReplyName, error);
        });
    });

    ipcMain.on('add-vector-from-message', async (event, schemaName: string, message: MessageInterface, uniqueReplyName: string) => {
        addVectorFromMessage(schemaName, message).then(() => {
            event.reply(uniqueReplyName, true);
        }).catch((error) => {
            event.reply(uniqueReplyName, error);
        });
    });

    ipcMain.on('get-vector', async (event, text: string, uniqueReplyName: string) => {
        getVector(text).then((vector) => {
            event.reply(uniqueReplyName, vector);
        }).catch((error) => {
            event.reply(uniqueReplyName, error);
        });
    });

    ipcMain.on('delete-index', async (event, schemaName: string, uniqueReplyName: string) => {
        deleteIndex(schemaName).then(() => {
            event.reply(uniqueReplyName, true);
        }).catch((error) => {
            event.reply(uniqueReplyName, error);
        });
    });
}