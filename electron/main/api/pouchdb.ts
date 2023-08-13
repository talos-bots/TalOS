import { ipcMain } from 'electron';
import PouchDB from 'pouchdb';
import { dataPath } from '../';

let agentDB: PouchDB.Database<any>;
let chatsDB: PouchDB.Database<any>;
let commandDB: PouchDB.Database<any>;
let attachmentDB: PouchDB.Database<any>;

export function getAllAgents() {
    agentDB.allDocs({include_docs: true}).then((result) => {
        return result.rows;
    }).catch((err) => {
        console.log(err);
    });
}

export function getAgent(id: string) {
    agentDB.get(id).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export function addAgent(agent: any) {
    agentDB.put(agent).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export function removeAgent(id: string) {
    agentDB.get(id).then((doc) => {
        return agentDB.remove(doc);
    }).catch((err) => {
        console.log(err);
    });
}
export function updateAgent(agent: any) {
    agentDB.get(agent._id).then((doc) => {
        // Merge existing fields with updated fields and retain _rev
        let updatedDoc = {...doc, ...agent};
        
        agentDB.put(updatedDoc).then((result) => {
            return result;
        }).catch((err) => {
            console.error('Error while updating document: ', err);
        });
    }).catch((err) => {
        console.error('Error while getting document: ', err);
    });
}

export function getAllChats() {
    chatsDB.allDocs({include_docs: true}).then((result) => {
        return result.rows;
    }).catch((err) => {
        console.log(err);
    });
}

export function getChatsByAgent(agentId: string) {
    chatsDB.find({
        selector: {
            agents: agentId
        }
    }).then((result) => {
        return result.docs;
    }).catch((err) => {
        console.log(err);
    });
}

export function getChat(id: string) {
    chatsDB.get(id).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export function addChat(chat: any) {
    chatsDB.put(chat).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export function removeChat(id: string) {
    chatsDB.get(id).then((doc) => {
        return chatsDB.remove(doc);
    }).catch((err) => {
        console.log(err);
    });
}

export function updateChat(chat: any) {
    chatsDB.get(chat._id).then((doc) => {
        // Merge existing fields with updated fields and retain _rev
        let updatedDoc = {...doc, ...chat};

        chatsDB.put(updatedDoc).then((result) => {
            return result;
        }).catch((err) => {
            console.error('Error while updating document: ', err);
        });
    }).catch((err) => {
        console.error('Error while getting document: ', err);
    });
}

export function getAllCommands() {
    commandDB.allDocs({include_docs: true}).then((result) => {
        return result.rows;
    }).catch((err) => {
        console.log(err);
    });
}

export function getCommand(id: string) {
    commandDB.get(id).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export function addCommand(command: any) {
    commandDB.put(command).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export function removeCommand(id: string) {
    commandDB.get(id).then((doc) => {
        return commandDB.remove(doc);
    }).catch((err) => {
        console.log(err);
    });
}

export function updateCommand(command: any) {
    commandDB.get(command._id).then((doc) => {
        // Merge existing fields with updated fields and retain _rev
        let updatedDoc = {...doc, ...command};

        commandDB.put(updatedDoc).then((result) => {
            return result;
        }).catch((err) => {
            console.error('Error while updating document: ', err);
        });
    }).catch((err) => {
        console.error('Error while getting document: ', err);
    });
}

export function getAllAttachments() {
    attachmentDB.allDocs({include_docs: true}).then((result) => {
        return result.rows;
    }).catch((err) => {
        console.log(err);
    });
}

export function getAttachment(id: string) {
    attachmentDB.get(id).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export function addAttachment(attachment: any) {
    attachmentDB.put(attachment).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export function removeAttachment(id: string) {
    attachmentDB.get(id).then((doc) => {
        return attachmentDB.remove(doc);
    }).catch((err) => {
        console.log(err);
    });
}

export function updateAttachment(attachment: any) {
    attachmentDB.get(attachment._id).then((doc) => {
        // Merge existing fields with updated fields and retain _rev
        let updatedDoc = {...doc, ...attachment};
        
        attachmentDB.put(updatedDoc).then((result) => {
            return result;
        }).catch((err) => {
            console.error('Error while updating document: ', err);
        });
    }).catch((err) => {
        console.error('Error while getting document: ', err);
    });
}

export function PouchDBRoutes(){
    agentDB = new PouchDB('agents', {prefix: dataPath});
    chatsDB = new PouchDB('chats', {prefix: dataPath});
    commandDB = new PouchDB('commands', {prefix: dataPath});
    attachmentDB = new PouchDB('attachments', {prefix: dataPath});

    ipcMain.on('get-agents', (event, arg) => {
        event.sender.send('get-agents-reply', getAllAgents());
    });

    ipcMain.on('get-agent', (event, arg) => {
        event.sender.send('get-agent-reply', getAgent(arg));
    });

    ipcMain.on('add-agent', (event, arg) => {
        event.sender.send('add-agent-reply', addAgent(arg));
    });

    ipcMain.on('update-agent', (event, arg) => {
        event.sender.send('update-agent-reply', updateAgent(arg));
    });

    ipcMain.on('delete-agent', (event, arg) => {
        event.sender.send('delete-agent-reply', removeAgent(arg));
    });

    ipcMain.on('get-chats', (event, arg) => {
        event.sender.send('get-chats-reply', getAllChats());
    });

    ipcMain.on('get-chats-by-agent', (event, arg) => {
        event.sender.send('get-chats-by-agent-reply', getChatsByAgent(arg));
    });

    ipcMain.on('get-chat', (event, arg) => {
        event.sender.send('get-chat-reply', getChat(arg));
    });

    ipcMain.on('add-chat', (event, arg) => {
        event.sender.send('add-chat-reply', addChat(arg));
    });

    ipcMain.on('update-chat', (event, arg) => {
        event.sender.send('update-chat-reply', updateChat(arg));
    });

    ipcMain.on('delete-chat', (event, arg) => {
        event.sender.send('delete-chat-reply', removeChat(arg));
    });

    ipcMain.on('get-commands', (event, arg) => {
        event.sender.send('get-commands-reply', getAllCommands());
    });

    ipcMain.on('get-command', (event, arg) => {
        event.sender.send('get-command-reply', getCommand(arg));
    });

    ipcMain.on('add-command', (event, arg) => {
        event.sender.send('add-command-reply', addCommand(arg));
    });

    ipcMain.on('update-command', (event, arg) => {
        event.sender.send('update-command-reply', updateCommand(arg));
    });

    ipcMain.on('delete-command', (event, arg) => {
        event.sender.send('delete-command-reply', removeCommand(arg));
    });

    ipcMain.on('get-attachments', (event, arg) => {
        event.sender.send('get-attachments-reply', getAllAttachments());
    });

    ipcMain.on('get-attachment', (event, arg) => {
        event.sender.send('get-attachment-reply', getAttachment(arg));
    });

    ipcMain.on('add-attachment', (event, arg) => {
        event.sender.send('add-attachment-reply', addAttachment(arg));
    });

    ipcMain.on('update-attachment', (event, arg) => {
        event.sender.send('update-attachment-reply', updateAttachment(arg));
    });

    ipcMain.on('delete-attachment', (event, arg) => {
        event.sender.send('delete-attachment-reply', removeAttachment(arg));
    });


    ipcMain.on('clear-data', (event, arg) => {
        agentDB.destroy();
        chatsDB.destroy();
        commandDB.destroy();
        attachmentDB.destroy();
        createDBs();
    });

    function createDBs (){
        agentDB = new PouchDB('agents', {prefix: dataPath});
        chatsDB = new PouchDB('chats', {prefix: dataPath});
        commandDB = new PouchDB('commands', {prefix: dataPath});
        attachmentDB = new PouchDB('attachments', {prefix: dataPath});
    }

    return {
        agentDB,
        chatsDB,
        commandDB,
        attachmentDB,
    }
};