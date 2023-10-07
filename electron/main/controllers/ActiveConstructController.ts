import Store from 'electron-store';

const constructSettings = new Store(
    {
        name: 'constructSettings',
        defaults: {
            doSystemInfo: true
        }
    }
);

export function getDoSystemInfo(): boolean{
    return constructSettings.get('doSystemInfo') as boolean || true;
}

export function setDoSystemInfo(doSystemSettings: boolean){
    constructSettings.set('doSystemInfo', doSystemSettings);
}
