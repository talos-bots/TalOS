import Store from 'electron-store';
import { expressApp } from '..';
import { CompletionInterface, CompletionLogInterface } from '../types/types';
import { getGPTTokens } from '../helpers/helpers';
import { settings } from '../api/llm';
type Tokenizer = 'OpenAI' | 'LLaMA';

async function completeDocument(document: CompletionLogInterface, guidance: string){
    let prompt: string = '';
    const currentSettings = settings;
    let leftOverTokens = currentSettings.max_context_length - getGPTTokens(guidance);
    const completions = fillCompletionContextToLimit(document, leftOverTokens);
    prompt += assembleCompletionLog(completions);
}

function assembleCompletionLog(messages: CompletionInterface[]){
    let prompt: string = '';
    messages.forEach(message => {
        prompt += message.content;
    });
    return prompt;
}

function fillCompletionContextToLimit(chatLog: CompletionLogInterface, tokenLimit: number, tokenizer: Tokenizer = 'LLaMA'){
    const messagesToInclude: CompletionInterface[] = [];
    let tokenCount = 0;
    for(let i = chatLog.completions.length - 1; i >= 0; i--){
        const message = chatLog.completions[i];
        let tokens: number;
        if(tokenizer === 'OpenAI'){
            tokens = getGPTTokens(message.content);
        } else {
            tokens = getGPTTokens(message.content);
        }
        if(tokens+ tokenCount <= tokenLimit){
            messagesToInclude.unshift(message);
            tokenCount += tokens;
        } else {
            break;
        }
    }
    return messagesToInclude;
}

export async function CompletionController(){

}