import { dataPath, isDarwin } from '../';
import { ipcMain } from 'electron';
import path from 'path';
import { LocalIndex } from 'vectra';
import { MessageInterface } from '../types/types';
require('@tensorflow/tfjs');
import use from '@tensorflow-models/universal-sentence-encoder';

export async function getAllVectors(schemaName: string){
    const indexPath = path.join(dataPath, schemaName);
    const index = new LocalIndex(indexPath);
    if (!await index.isIndexCreated()) {
        await index.createIndex();
    }
    const vectors = await index.listItems();
    return vectors;
}

export async function getRelaventMemories(schemaName: string, text: string){
    const indexPath = path.join(dataPath, schemaName);
    const index = new LocalIndex(indexPath);
    if (!await index.isIndexCreated()) {
        await index.createIndex();
    }
    const vector = await getVector(text);
    const memories = await index.queryItems(vector, 10);
    return memories;
}

export async function addVectorFromMessage(schemaName: string, message: MessageInterface){
    const indexPath = path.join(dataPath, schemaName);
    const index = new LocalIndex(indexPath);
    if (!await index.isIndexCreated()) {
        await index.createIndex();
    }
    await index.insertItem({
        vector: await getVector(message.text),
        metadata: message
    });
}

export async function getVector(text: string){
    return use.load().then(async (model) => {
        const embeddings = await model.embed([text]);
        return embeddings.arraySync()[0];
    });
}

export async function deleteIndex(schemaName: string){
    const indexPath = path.join(dataPath, schemaName);
    const index = new LocalIndex(indexPath);
    if (await index.isIndexCreated()) {
        await index.deleteIndex();
    }
}

export function VectorDBRoutes(){
    ipcMain.on('get-all-vectors', async (event, schemaName: string, uniqueReplyName: string) => {
        getAllVectors(schemaName).then((vectors) => {
            event.reply(uniqueReplyName, vectors);
        });
    });

    ipcMain.on('get-relavent-memories', async (event, schemaName: string, text: string, uniqueReplyName: string) => {
        getRelaventMemories(schemaName, text).then((memories) => {
            event.reply(uniqueReplyName, memories);
        });
    });

    ipcMain.on('add-vector-from-message', async (event, schemaName: string, message: MessageInterface, uniqueReplyName: string) => {
        addVectorFromMessage(schemaName, message).then(() => {
            event.reply(uniqueReplyName, true);
        });
    });

    ipcMain.on('get-vector', async (event, text: string, uniqueReplyName: string) => {
        getVector(text).then((vector) => {
            event.reply(uniqueReplyName, vector);
        });
    });

    ipcMain.on('delete-index', async (event, schemaName: string, uniqueReplyName: string) => {
        deleteIndex(schemaName).then(() => {
            event.reply(uniqueReplyName, true);
        });
    });
}