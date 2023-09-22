import { ipcMain } from 'electron';
import PouchDB from 'pouchdb';
import { dataPath, expressApp, isDarwin } from '../';
import LeveldbAdapter from 'pouchdb-adapter-leveldb';
import { addAttachmentFromEDB, addChatFromEDB, addCommandFromEDB, addCompletionFromEDB, addConstructFromEDB, addInstructFromEDB, addLorebookFromEDB, addUserFromEDB, getAttachmentFromEDB, getAttachmentsFromEDB, getChatFromEDB, getChatsByConstructFromEDB, getChatsFromEDB, getCommandFromEDB, getCommandsFromEDB, getCompletionFromEDB, getCompletionsFromEDB, getConstructFromEDB, getConstructsFromEDB, getInstructFromEDB, getInstructsFromEDB, getLorebookFromEDB, getLorebooksFromEDB, getUserFromEDB, getUsersFromEDB, removeAttachmentFromEDB, removeChatFromEDB, removeCommandFromEDB, removeCompletionFromEDB, removeConstructFromEDB, removeInstructFromEDB, removeLorebookFromEDB, removeUserFromEDB } from './electrondb';

let constructDB: PouchDB.Database<any>;
let chatsDB: PouchDB.Database<any>;
let commandDB: PouchDB.Database<any>;
let attachmentDB: PouchDB.Database<any>;
let instructDB: PouchDB.Database<any>;
let completionDB: PouchDB.Database<any>;
let userDB: PouchDB.Database<any>;
let lorebookDB: PouchDB.Database<any>;

PouchDB.plugin(LeveldbAdapter);

export async function getAllConstructs() {
    if(isDarwin){
        return getConstructsFromEDB();
    }
    return constructDB.allDocs({include_docs: true})
    .then((result) => {
        return result.rows;
    })
    .catch((err) => {
        console.log(err);
        return null;
    });
}

export async function getConstruct(id: string) {
    if(isDarwin){
        return getConstructFromEDB(id);
    }
    return constructDB.get(id).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function addConstruct(construct: any) {
    if(isDarwin){
        addConstructFromEDB(construct._id, construct);
        return;
    }
    return constructDB.put(construct).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function removeConstruct(id: string) {
    if(isDarwin){
        removeConstructFromEDB(id);
        return;
    }
    return constructDB.get(id).then((doc) => {
        return constructDB.remove(doc);
    }).catch((err) => {
        console.log(err);
    });
}

export async function updateConstruct(construct: any) {
    if(isDarwin){
        addConstructFromEDB(construct._id, construct);
        return;
    }
    return constructDB.get(construct._id).then((doc) => {
        // Merge existing fields with updated fields and retain _rev
        let updatedDoc = {...doc, ...construct};
        
        constructDB.put(updatedDoc).then((result) => {
            return result;
        }).catch((err) => {
            console.error('Error while updating document: ', err);
        });
    }).catch((err) => {
        console.error('Error while getting document: ', err);
    });
}

export async function getAllChats() {
    if(isDarwin){
        return getChatsFromEDB();
    }
    return chatsDB.allDocs({include_docs: true}).then((result) => {
        return result.rows;
    }).catch((err) => {
        console.log(err);
    });
}

export async function getChatsByConstruct(constructId: string) {
    if(isDarwin){
        return getChatsByConstructFromEDB(constructId);
    }
    return chatsDB.find({
        selector: {
            constructs: constructId
        }
    }).then((result) => {
        return result.docs;
    }).catch((err) => {
        console.log(err);
    });
}

export async function getChat(id: string) {
    if(isDarwin){
        return getChatFromEDB(id);
    }
    return chatsDB.get(id).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function addChat(chat: any) {
    if(isDarwin){
        addChatFromEDB(chat._id, chat);
        return;
    }
    return chatsDB.put(chat).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function removeChat(id: string) {
    if(isDarwin){
        removeChatFromEDB(id);
        return;
    }
    return chatsDB.get(id).then((doc) => {
        return chatsDB.remove(doc);
    }).catch((err) => {
        console.log(err);
    });
}

export async function updateChat(chat: any) {
    if(isDarwin){
        addChatFromEDB(chat._id, chat);
        return;
    }
    return chatsDB.get(chat._id).then((doc) => {
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

export async function getAllCommands() {
    if(isDarwin){
        return getCommandsFromEDB();
    }
    return commandDB.allDocs({include_docs: true}).then((result) => {
        return result.rows;
    }).catch((err) => {
        console.log(err);
    });
}

export async function getCommand(id: string) {
    if(isDarwin){
        return getCommandFromEDB(id);
    }
    return commandDB.get(id).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function addCommand(command: any) {
    if(isDarwin){
        addCommandFromEDB(command._id, command);
        return;
    }
    return commandDB.put(command).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function removeCommand(id: string) {
    if(isDarwin){
        removeCommandFromEDB(id);
        return;
    }
    return commandDB.get(id).then((doc) => {
        return commandDB.remove(doc);
    }).catch((err) => {
        console.log(err);
    });
}

export async function updateCommand(command: any) {
    if(isDarwin){
        addCommandFromEDB(command._id, command);
        return;
    }
    return commandDB.get(command._id).then((doc) => {
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

export async function getAllAttachments() {
    if(isDarwin){
        return getAttachmentsFromEDB();
    }
    return attachmentDB.allDocs({include_docs: true}).then((result) => {
        return result.rows;
    }).catch((err) => {
        console.log(err);
    });
}

export async function getAttachment(id: string) {
    if(isDarwin){
        return getAttachmentFromEDB(id);
    }
    return attachmentDB.get(id).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function addAttachment(attachment: any) {
    if(isDarwin){
        addAttachmentFromEDB(attachment._id, attachment);
        return;
    }
    return attachmentDB.put(attachment).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function removeAttachment(id: string) {
    if(isDarwin){
        removeAttachmentFromEDB(id);
        return;
    }
    return attachmentDB.get(id).then((doc) => {
        return attachmentDB.remove(doc);
    }).catch((err) => {
        console.log(err);
    });
}

export async function updateAttachment(attachment: any) {
    if(isDarwin){
        addAttachmentFromEDB(attachment._id, attachment);
        return;
    }
    return attachmentDB.get(attachment._id).then((doc) => {
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

export async function getAllInstructs() {
    if(isDarwin){
        return getInstructsFromEDB();
    }
    return instructDB.allDocs({include_docs: true}).then((result) => {
        return result.rows;
    }).catch((err) => {
        console.log(err);
    });
}

export async function getInstruct(id: string) {
    if(isDarwin){
        return getInstructFromEDB(id);
    }
    return instructDB.get(id).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function addInstruct(instruct: any) {
    if(isDarwin){
        addInstructFromEDB(instruct._id, instruct);
        return;
    }
    return instructDB.put(instruct).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function removeInstruct(id: string) {
    if(isDarwin){
        removeInstructFromEDB(id);
        return;
    }
    return instructDB.get(id).then((doc) => {
        return instructDB.remove(doc);
    }).catch((err) => {
        console.log(err);
    });
}

export async function updateInstruct(instruct: any) {
    if(isDarwin){
        addInstructFromEDB(instruct._id, instruct);
        return;
    }
    return instructDB.get(instruct._id).then((doc) => {
        // Merge existing fields with updated fields and retain _rev
        let updatedDoc = {...doc, ...instruct};

        instructDB.put(updatedDoc).then((result) => {
            return result;
        }).catch((err) => {
            console.error('Error while updating document: ', err);
        });
    }).catch((err) => {
        console.error('Error while getting document: ', err);
    });
}

export async function getAllCompletions() {
    if(isDarwin){
        return getCompletionsFromEDB();
    }
    return completionDB.allDocs({include_docs: true}).then((result) => {
        return result.rows;
    }).catch((err) => {
        console.log(err);
    });
}

export async function getCompletion(id: string) {
    if(isDarwin){
        return getCompletionFromEDB(id);
    }
    return completionDB.get(id).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function addCompletion(completion: any) {
    if(isDarwin){
        addCompletionFromEDB(completion._id, completion);
        return;
    }
    return completionDB.put(completion).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function removeCompletion(id: string) {
    if(isDarwin){
        removeCompletionFromEDB(id);
        return;
    }
    return completionDB.get(id).then((doc) => {
        return completionDB.remove(doc);
    }).catch((err) => {
        console.log(err);
    });
}

export async function updateCompletion(completion: any) {
    if(isDarwin){
        addCompletionFromEDB(completion._id, completion);
        return;
    }
    return completionDB.get(completion._id).then((doc) => {
        // Merge existing fields with updated fields and retain _rev
        let updatedDoc = {...doc, ...completion};

        completionDB.put(updatedDoc).then((result) => {
            return result;
        }).catch((err) => {
            console.error('Error while updating document: ', err);
        });
    }).catch((err) => {
        console.error('Error while getting document: ', err);
    });
}

export async function getUsers() {
    if(isDarwin){
        return getUsersFromEDB();
    }
    return userDB.allDocs({include_docs: true}).then((result) => {
        return result.rows;
    }).catch((err) => {
        console.log(err);
    });
}

export async function getUser(id: string) {
    if(isDarwin){
        return getUserFromEDB(id);
    }
    return userDB.get(id).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function addUser(user: any) {
    if(isDarwin){
        addUserFromEDB(user._id, user);
        return;
    }
    return userDB.put(user).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function removeUser(id: string) {
    if(isDarwin){
        removeUserFromEDB(id);
        return;
    }
    return userDB.get(id).then((doc) => {
        return userDB.remove(doc);
    }).catch((err) => {
        console.log(err);
    });
}

export async function updateUser(user: any) {
    if(isDarwin){
        addUserFromEDB(user._id, user);
        return;
    }
    return userDB.get(user._id).then((doc) => {
        // Merge existing fields with updated fields and retain _rev
        let updatedDoc = {...doc, ...user};

        userDB.put(updatedDoc).then((result) => {
            return result;
        }).catch((err) => {
            console.error('Error while updating document: ', err);
        });
    }).catch((err) => {
        console.error('Error while getting document: ', err);
    });
}

export async function getLorebooks() {
    if(isDarwin){
        return getLorebooksFromEDB();
    }
    return lorebookDB.allDocs({include_docs: true}).then((result) => {
        return result.rows;
    }).catch((err) => {
        console.log(err);
    });
}

export async function getLorebook(id: string) {
    if(isDarwin){
        return getLorebookFromEDB(id);
    }
    return lorebookDB.get(id).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function addLorebook(lorebook: any) {
    if(isDarwin){
        addLorebookFromEDB(lorebook._id, lorebook);
        return;
    }
    return lorebookDB.put(lorebook).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

export async function removeLorebook(id: string) {
    if(isDarwin){
        removeLorebookFromEDB(id);
        return;
    }
    return lorebookDB.get(id).then((doc) => {
        return lorebookDB.remove(doc);
    }).catch((err) => {
        console.log(err);
    });
}

export async function updateLorebook(lorebook: any) {
    if(isDarwin){
        addLorebookFromEDB(lorebook._id, lorebook);
        return;
    }
    return lorebookDB.get(lorebook._id).then((doc) => {
        // Merge existing fields with updated fields and retain _rev
        let updatedDoc = {...doc, ...lorebook};

        lorebookDB.put(updatedDoc).then((result) => {
            return result;
        }).catch((err) => {
            console.error('Error while updating document: ', err);
        });
    }).catch((err) => {
        console.error('Error while getting document: ', err);
    });
}

export function PouchDBRoutes(){
    constructDB = new PouchDB('constructs', {prefix: dataPath, adapter : 'leveldb'});
    chatsDB = new PouchDB('chats', {prefix: dataPath, adapter : 'leveldb'});
    commandDB = new PouchDB('commands', {prefix: dataPath, adapter : 'leveldb'});
    attachmentDB = new PouchDB('attachments', {prefix: dataPath, adapter : 'leveldb'});
    instructDB = new PouchDB('instructs', {prefix: dataPath, adapter : 'leveldb'});
    completionDB = new PouchDB('completion', {prefix: dataPath, adapter : 'leveldb'});
    userDB = new PouchDB('user', {prefix: dataPath, adapter : 'leveldb'});
    lorebookDB = new PouchDB('lorebook', {prefix: dataPath, adapter : 'leveldb'});

    expressApp.get('/api/constructs', async (req, res) => {
        try {
            const constructs = await getAllConstructs();
            res.json(constructs);
        } catch (error) {
            res.status(500).json({ message: "An error occurred." });
        }
    });

    expressApp.get('/api/construct/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const construct = await getConstruct(id);
            if (construct) {
                res.json(construct);
            } else {
                res.status(404).json({ message: "Construct not found." });
            }
        } catch (error) {
            res.status(500).json({ message: "An error occurred." });
        }
    });

    expressApp.post('/api/add-construct', async (req, res) => {
        try {
            const construct = req.body;
            const result = await addConstruct(construct); // Assuming addConstruct() is a function in your backend logic
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: "An error occurred while adding the construct." });
        }
    });
    
    expressApp.put('/api/update-construct', async (req, res) => {
        try {
            const construct = req.body;
            const result = await updateConstruct(construct); // Assuming updateConstruct() is a function in your backend logic
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: "An error occurred while updating the construct." });
        }
    });
    
    expressApp.delete('/api/delete-construct/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const result = await removeConstruct(id); // Assuming removeConstruct() is a function in your backend logic
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: "An error occurred while deleting the construct." });
        }
    });

    expressApp.get('/api/chats', async (req, res) => {
        try {
            const chats = await getAllChats();
            res.json(chats);
        } catch (error) {
            res.status(500).json({ message: "An error occurred." });
        }
    });
    
    // For 'get-chats-by-construct'
    expressApp.get('/api/chats/construct/:constructId', async (req, res) => {
        try {
            const constructId = req.params.constructId;
            const chats = await getChatsByConstruct(constructId);
            res.json(chats);
        } catch (error) {
            res.status(500).json({ message: "An error occurred." });
        }
    });
    
    // For 'get-chat'
    expressApp.get('/api/chat/:chatId', async (req, res) => {
        try {
            const chatId = req.params.chatId;
            const chat = await getChat(chatId);
            res.json(chat);
        } catch (error) {
            res.status(500).json({ message: "An error occurred." });
        }
    });
    
    // For 'add-chat'
    expressApp.post('/api/chat', async (req, res) => {
        try {
            const chatData = req.body;
            const chat = await addChat(chatData);
            res.json(chat);
        } catch (error) {
            res.status(500).json({ message: "An error occurred." });
        }
    });
    
    // For 'update-chat'
    expressApp.put('/api/chat', async (req, res) => {
        try {
            const chatData = req.body;
            const chat = await updateChat(chatData);
            res.json(chat);
        } catch (error) {
            res.status(500).json({ message: "An error occurred." });
        }
    });
    
    // For 'delete-chat'
    expressApp.delete('/api/chat/:chatId', async (req, res) => {
        try {
            const chatId = req.params.chatId;
            const result = await removeChat(chatId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: "An error occurred." });
        }
    });

    ipcMain.on('get-commands', (event, replyName) => {
        getAllCommands().then((result) => {
            event.sender.send(replyName, result);
        });
    });

    ipcMain.on('get-command', (event, arg, replyName) => {
        getCommand(arg).then((result) => {
            event.sender.send(replyName, result);
        });
    });

    ipcMain.on('add-command', (event, arg) => {
        addCommand(arg).then((result) => {
            event.sender.send('add-command-reply', result);
        });
    });

    ipcMain.on('update-command', (event, arg) => {
        updateCommand(arg).then((result) => {
            event.sender.send('update-command-reply', result);
        });
    });

    ipcMain.on('delete-command', (event, arg) => {
        removeCommand(arg).then((result) => {
            event.sender.send('delete-command-reply', result);
        });
    });

    ipcMain.on('get-attachments', (event, replyName) => {
        getAllAttachments().then((result) => {
            event.sender.send(replyName, result);
        });
    });

    ipcMain.on('get-attachment', (event, arg, replyName) => {
        getAttachment(arg).then((result) => {
            event.sender.send(replyName, result);
        });
    });

    ipcMain.on('add-attachment', (event, arg) => {
        addAttachment(arg).then((result) => {
            event.sender.send('add-attachment-reply', result);
        });
    });

    ipcMain.on('update-attachment', (event, arg) => {
        updateAttachment(arg).then((result) => {
            event.sender.send('update-attachment-reply', result);
        });
    });

    ipcMain.on('delete-attachment', (event, arg) => {
        removeAttachment(arg).then((result) => {
            event.sender.send('delete-attachment-reply', result);
        });
    });

    ipcMain.on('get-instructs', (event, replyName) => {
        getAllInstructs().then((result) => {
            event.sender.send(replyName, result);
        });
    });

    ipcMain.on('get-instruct', (event, arg, replyName) => {
        getInstruct(arg).then((result) => {
            event.sender.send(replyName, result);
        });
    });

    ipcMain.on('add-instruct', (event, arg) => {
        addInstruct(arg).then((result) => {
            event.sender.send('add-instruct-reply', result);
        });
    });

    ipcMain.on('update-instruct', (event, arg) => {
        updateInstruct(arg).then((result) => {
            event.sender.send('update-instruct-reply', result);
        });
    });

    ipcMain.on('delete-instruct', (event, arg) => {
        removeInstruct(arg).then((result) => {
            event.sender.send('delete-instruct-reply', result);
        });
    });

    ipcMain.on('get-completions', (event, replyName) => {
        getAllCompletions().then((result) => {
            event.sender.send(replyName, result);
        });
    });

    ipcMain.on('get-completion', (event, arg, replyName) => {
        getCompletion(arg).then((result) => {
            event.sender.send(replyName, result);
        });
    });

    ipcMain.on('add-completion', (event, arg) => {
        addCompletion(arg).then((result) => {
            event.sender.send('add-completion-reply', result);
        });
    });

    ipcMain.on('update-completion', (event, arg) => {
        updateCompletion(arg).then((result) => {
            event.sender.send('update-completion-reply', result);
        });
    });

    ipcMain.on('delete-completion', (event, arg) => {
        removeCompletion(arg).then((result) => {
            event.sender.send('delete-completion-reply', result);
        });
    });

    ipcMain.on('get-users', (event, replyName) => {
        getUsers().then((result) => {
            event.sender.send(replyName, result);
        });
    });

    ipcMain.on('get-user', (event, arg, replyName) => {
        getUser(arg).then((result) => {
            event.sender.send(replyName, result);
        });
    });

    ipcMain.on('add-user', (event, arg) => {
        addUser(arg).then((result) => {
            event.sender.send('add-user-reply', result);
        });
    });

    ipcMain.on('update-user', (event, arg) => {
        updateUser(arg).then((result) => {
            event.sender.send('update-user-reply', result);
        });
    });

    ipcMain.on('delete-user', (event, arg) => {
        removeUser(arg).then((result) => {
            event.sender.send('delete-user-reply', result);
        });
    });
    
    ipcMain.on('get-lorebooks', (event, replyName) => {
        getLorebooks().then((result) => {
            event.sender.send(replyName, result);
        });
    });

    ipcMain.on('get-lorebook', (event, arg, replyName) => {
        getLorebook(arg).then((result) => {
            event.sender.send(replyName, result);
        });
    });

    ipcMain.on('add-lorebook', (event, arg) => {
        addLorebook(arg).then((result) => {
            event.sender.send('add-lorebook-reply', result);
        });
    });

    ipcMain.on('update-lorebook', (event, arg) => {
        updateLorebook(arg).then((result) => {
            event.sender.send('update-lorebook-reply', result);
        });
    });

    ipcMain.on('delete-lorebook', (event, arg) => {
        removeLorebook(arg).then((result) => {
            event.sender.send('delete-lorebook-reply', result);
        });
    });

    ipcMain.on('clear-data', (event, arg) => {
        constructDB.destroy();
        chatsDB.destroy();
        commandDB.destroy();
        attachmentDB.destroy();
        instructDB.destroy();
        completionDB.destroy();
        userDB.destroy();
        lorebookDB.destroy();
        createDBs();
    });

    function createDBs (){
        constructDB = new PouchDB('constructs', {prefix: dataPath, adapter : 'leveldb'});
        chatsDB = new PouchDB('chats', {prefix: dataPath, adapter : 'leveldb'});
        commandDB = new PouchDB('commands', {prefix: dataPath, adapter : 'leveldb'});
        attachmentDB = new PouchDB('attachments', {prefix: dataPath, adapter : 'leveldb'});
        instructDB = new PouchDB('instructs', {prefix: dataPath, adapter : 'leveldb'});
        completionDB = new PouchDB('completion', {prefix: dataPath, adapter : 'leveldb'});
        userDB = new PouchDB('user', {prefix: dataPath, adapter : 'leveldb'});
        lorebookDB = new PouchDB('lorebook', {prefix: dataPath, adapter : 'leveldb'});
    }
};