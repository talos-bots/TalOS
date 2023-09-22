import { Message } from "@/classes/Message";
import axios from "axios";

export async function getVector(text: string): Promise<any[]> {
    try {
        const response = await axios.get(`/api/vector`, { params: { text } });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to get vector.');
    }
}

export async function getAllVectors(schemaName: string) {
    try {
        const response = await axios.get(`/api/vectors/${schemaName}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to get all vectors.');
    }
}

export async function getRelaventMemories(schemaName: string, text: string) {
    try {
        const response = await axios.get(`/api/memories/${schemaName}`, { params: { text } });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to get relevant memories.');
    }
}

export async function addVectorFromMessage(schemaName: string, message: Message) {
    try {
        const response = await axios.post(`/api/vector/${schemaName}`, message);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to add vector from message.');
    }
}

export async function removeAllMemories(schemaName: string) {
    try {
        const response = await axios.delete(`/api/index/${schemaName}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Failed to remove all memories.');
    }
}