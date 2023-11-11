import Store from 'electron-store';
import { expressApp } from '../server';

const constructSettings = new Store(
    {
        name: 'constructSettings',
        defaults: {
            doSystemInfo: true,
            doRandomMessages: true,
            doRandomThoughts: true,
            doRandomActions: true,
            showDiscordUserInfo: false,
            thoughtInterval: 10,
            actionInterval: 10,
            messageInterval: 10,
        }
    }
);

function milisecondsToMinutes(miliseconds: number): number{
    return miliseconds / 60000;
}

function minutesToMiliseconds(minutes: number): number{
    return minutes * 60000;
}

export function getDoRandomMessages(): boolean{
    return constructSettings.get('doRandomMessages') as boolean || true;
}

export function setDoRandomMessages(doRandomMessages: boolean){
    constructSettings.set('doRandomMessages', doRandomMessages);
}

export function getDoRandomThoughts(): boolean{
    return constructSettings.get('doRandomThoughts') as boolean || true;
}

export function setDoRandomThoughts(doRandomThoughts: boolean){
    constructSettings.set('doRandomThoughts', doRandomThoughts);
}

export function getDoRandomActions(): boolean{
    return constructSettings.get('doRandomActions') as boolean || true;
}

export function setDoRandomActions(doRandomActions: boolean){
    constructSettings.set('doRandomActions', doRandomActions);
}

export function getThoughtInterval(): number{
    return constructSettings.get('thoughtInterval') as number || 10;
}

export function setThoughtInterval(thoughtInterval: number){
    constructSettings.set('thoughtInterval', thoughtInterval);
}

export function getActionInterval(): number{
    return constructSettings.get('actionInterval') as number || 10;
}

export function setActionInterval(actionInterval: number){
    constructSettings.set('actionInterval', actionInterval);
}

export function getMessageInterval(): number{
    return constructSettings.get('messageInterval') as number || 10;
}

export function setMessageInterval(messageInterval: number){
    constructSettings.set('messageInterval', messageInterval);
}

export function getDoSystemInfo(): boolean{
    return constructSettings.get('doSystemInfo') as boolean || true;
}

export function setDoSystemInfo(doSystemSettings: boolean){
    constructSettings.set('doSystemInfo', doSystemSettings);
}

export function getShowDiscordUserInfo(): boolean{
    return constructSettings.get('showDiscordUserInfo') as boolean || false;
}

export function setShowDiscordUserInfo(showDiscordUserInfo: boolean){
    constructSettings.set('showDiscordUserInfo', showDiscordUserInfo);
}

export async function ActiveConstructController(){

    expressApp.post('/api/constructs/set/systeminfo', (req, res) => {
        setDoSystemInfo(req.body.value);
        const currentDoSystemInfo = getDoSystemInfo();
        res.json({ doSystemInfo: currentDoSystemInfo });
    });

    expressApp.get('/api/constructs/systeminfo', (req, res) => {
        const currentDoSystemInfo = getDoSystemInfo();
        res.json({ doSystemInfo: currentDoSystemInfo });
    });

    expressApp.post('/api/constructs/set/randommessages', (req, res) => {
        setDoRandomMessages(req.body.value);
        const currentDoRandomMessages = getDoRandomMessages();
        res.json({ doRandomMessages: currentDoRandomMessages });
    });

    expressApp.get('/api/constructs/randommessages', (req, res) => {
        const currentDoRandomMessages = getDoRandomMessages();
        res.json({ doRandomMessages: currentDoRandomMessages });
    });

    expressApp.post('/api/constructs/set/randomthoughts', (req, res) => {
        setDoRandomThoughts(req.body.value);
        const currentDoRandomThoughts = getDoRandomThoughts();
        res.json({ doRandomThoughts: currentDoRandomThoughts });
    });

    expressApp.get('/api/constructs/randomthoughts', (req, res) => {
        const currentDoRandomThoughts = getDoRandomThoughts();
        res.json({ doRandomThoughts: currentDoRandomThoughts });
    });

    expressApp.post('/api/constructs/set/randomactions', (req, res) => {
        setDoRandomActions(req.body.value);
        const currentDoRandomActions = getDoRandomActions();
        res.json({ doRandomActions: currentDoRandomActions });
    });

    expressApp.get('/api/constructs/randomactions', (req, res) => {
        const currentDoRandomActions = getDoRandomActions();
        res.json({ doRandomActions: currentDoRandomActions });
    });

    expressApp.post('/api/constructs/set/thoughtinterval', (req, res) => {
        setThoughtInterval(req.body.value);
        const currentThoughtInterval = getThoughtInterval();
        res.json({ thoughtInterval: currentThoughtInterval });
    });

    expressApp.get('/api/constructs/thoughtinterval', (req, res) => {
        const currentThoughtInterval = getThoughtInterval();
        res.json({ thoughtInterval: currentThoughtInterval });
    });

    expressApp.post('/api/constructs/set/actioninterval', (req, res) => {
        setActionInterval(req.body.value);
        const currentActionInterval = getActionInterval();
        res.json({ actionInterval: currentActionInterval });
    });

    expressApp.get('/api/constructs/actioninterval', (req, res) => {
        const currentActionInterval = getActionInterval();
        res.json({ actionInterval: currentActionInterval });
    });

    expressApp.post('/api/constructs/set/messageinterval', (req, res) => {
        setMessageInterval(req.body.value);
        const currentMessageInterval = getMessageInterval();
        res.json({ messageInterval: currentMessageInterval });
    });

    expressApp.get('/api/constructs/messageinterval', (req, res) => {
        const currentMessageInterval = getMessageInterval();
        res.json({ messageInterval: currentMessageInterval });
    });

    expressApp.post('/api/constructs/set/showdiscorduserinfo', (req, res) => {
        setShowDiscordUserInfo(req.body.value);
        const currentShowDiscordUserInfo = getShowDiscordUserInfo();
        res.json({ showDiscordUserInfo: currentShowDiscordUserInfo });
    });

    expressApp.get('/api/constructs/showdiscorduserinfo', (req, res) => {
        const currentShowDiscordUserInfo = getShowDiscordUserInfo();
        res.json({ showDiscordUserInfo: currentShowDiscordUserInfo });
    });
    
}