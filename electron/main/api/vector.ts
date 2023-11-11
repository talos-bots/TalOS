import { dataPath, expressApp, isDarwin } from '../server.js';
import path from 'path';
import { LocalIndex } from 'vectra';
import { MessageInterface } from '../types/types.js';
import { getEmbedding } from '../model-pipeline/transformers.js';

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
    // 1. GET all vectors
    expressApp.get('/api/vectors/:schemaName', async (req, res) => {
        try {
            const vectors = await getAllVectors(req.params.schemaName);
            res.json(vectors);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    // 2. GET relevant memories
    expressApp.get('/api/memories/:schemaName', async (req, res) => {
        try {
            const memories = await getRelaventMemories(req.params.schemaName, req.query.text as string);
            res.json(memories);
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    // 3. POST to add vector from message
    expressApp.post('/api/vector/:schemaName', async (req, res) => {
        try {
            await addVectorFromMessage(req.params.schemaName, req.body);
            res.sendStatus(201); // 201: Created
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    // 4. GET a specific vector
    expressApp.get('/api/vector', async (req, res) => {
        try {
            const vector = await getVector(req.query.text as string);
            if (vector) {
                res.json(vector);
            } else {
                res.status(404).send({ error: 'Vector not found' });
            }
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });

    // 5. DELETE an index
    expressApp.delete('/api/index/:schemaName', async (req, res) => {
        try {
            await deleteIndex(req.params.schemaName);
            res.sendStatus(204); // 204: No Content
        } catch (error: any) {
            res.status(500).send({ error: error.message });
        }
    });
}