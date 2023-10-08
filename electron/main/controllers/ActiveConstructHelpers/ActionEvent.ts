export type ActionType = 'Thought' | 'Discord Message' | 'Selfie' | 'Web Search' | 'Desktop Message' | 'Summarize' | 'Remember'; 
export class ActionEvent{
    constructor(
        public _id: string = Date.toString(),
        public timestamp: number,
        public constructId: string,
        public type: ActionType,
        public input: string,
        public output: string,
    ){}
}

import Store from 'electron-store';

const actionLogSettings = new Store(
    {
        name: 'actionLogSettings',
        defaults: {
            actionLog: new Array<ActionEvent>(),
        }
    }
);

export function getActionLog(): Array<ActionEvent>{
    return actionLogSettings.get('actionLog') as Array<ActionEvent>;
}

export function setActionLog(actionLog: Array<ActionEvent>){
    actionLogSettings.set('actionLog', actionLog);
}

export function addActionEvent(actionEvent: ActionEvent){
    let actionLog = getActionLog();
    actionLog.push(actionEvent);
    setActionLog(actionLog);
}

export function removeActionEvent(actionEvent: ActionEvent){
    let actionLog = getActionLog();
    let index = actionLog.indexOf(actionEvent);
    if(index > -1){
        actionLog.splice(index, 1);
    }
    setActionLog(actionLog);
}

export function clearActionLog(){
    setActionLog(new Array<ActionEvent>());
}

export function getActionLogLength(): number{
    return getActionLog().length;
}