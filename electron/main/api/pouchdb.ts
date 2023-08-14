import { ipcMain } from 'electron';
import PouchDB from 'pouchdb';
import { dataPath } from '../';

let constructDB: PouchDB.Database<any>;
let chatsDB: PouchDB.Database<any>;
let commandDB: PouchDB.Database<any>;
let attachmentDB: PouchDB.Database<any>;
let instructDB: PouchDB.Database<any>;

export function PouchDBRoutes(){
    constructDB = new PouchDB('constructs', {prefix: dataPath});
    chatsDB = new PouchDB('chats', {prefix: dataPath});
    commandDB = new PouchDB('commands', {prefix: dataPath});
    attachmentDB = new PouchDB('attachments', {prefix: dataPath});
    instructDB = new PouchDB('instructs', {prefix: dataPath});

    ipcMain.on('get-agents', (event, arg) => {
        constructDB.allDocs({include_docs: true}).then((result) => {
            event.sender.send('get-agents-reply', result.rows);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('get-agent', (event, arg) => {
        constructDB.get(arg).then((result) => {
            event.sender.send('get-agent-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('add-agent', (event, arg) => {
        constructDB.put(arg).then((result) => {
            event.sender.send('add-agent-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('update-agent', (event, arg) => {
        constructDB.get(arg._id).then((doc) => {
            // Merge existing fields with updated fields and retain _rev
            let updatedDoc = {...doc, ...arg};

            constructDB.put(updatedDoc).then((result) => {
                event.sender.send('update-agent-reply', result);
            }).catch((err) => {
                console.error('Error while updating document: ', err);
            });
        }).catch((err) => {
            console.error('Error while getting document: ', err);
        }); 
    });

    ipcMain.on('delete-agent', (event, arg) => {
        constructDB.get(arg).then((doc) => {
            constructDB.remove(doc).then((result) => {
                event.sender.send('delete-agent-reply', result);
            }).catch((err) => {
                console.error('Error while deleting document: ', err);
            });
        }).catch((err) => {
            console.error('Error while getting document: ', err);
        }); 
    });

    ipcMain.on('get-chats', (event, arg) => {
        chatsDB.allDocs({include_docs: true}).then((result) => {
            event.sender.send('get-chats-reply', result.rows);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('get-chats-by-agent', (event, arg) => {
        chatsDB.find({
            selector: {
                agents: arg
            }
        }).then((result) => {
            event.sender.send('get-chats-by-agent-reply', result.docs);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('get-chat', (event, arg) => {
        chatsDB.get(arg).then((result) => {
            event.sender.send('get-chat-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('add-chat', (event, arg) => {
        chatsDB.put(arg).then((result) => {
            event.sender.send('add-chat-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('update-chat', (event, arg) => {
        chatsDB.get(arg._id).then((doc) => {
            // Merge existing fields with updated fields and retain _rev
            let updatedDoc = {...doc, ...arg};

            chatsDB.put(updatedDoc).then((result) => {
                event.sender.send('update-chat-reply', result);
            }).catch((err) => {
                console.error('Error while updating document: ', err);
            });
        }).catch((err) => {
            console.error('Error while getting document: ', err);
        });
    });

    ipcMain.on('delete-chat', (event, arg) => {
        chatsDB.get(arg).then((doc) => {
            chatsDB.remove(doc).then((result) => {
                event.sender.send('delete-chat-reply', result);
            }).catch((err) => {
                console.error('Error while deleting document: ', err);
            });
        }).catch((err) => {
            console.error('Error while getting document: ', err);
        });
    });

    ipcMain.on('get-commands', (event, arg) => {
        commandDB.allDocs({include_docs: true}).then((result) => {
            event.sender.send('get-commands-reply', result.rows);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('get-command', (event, arg) => {
        commandDB.get(arg).then((result) => {
            event.sender.send('get-command-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('add-command', (event, arg) => {
        commandDB.put(arg).then((result) => {
            event.sender.send('add-command-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('update-command', (event, arg) => {
        commandDB.get(arg._id).then((doc) => {
            // Merge existing fields with updated fields and retain _rev
            let updatedDoc = {...doc, ...arg};

            commandDB.put(updatedDoc).then((result) => {
                event.sender.send('update-command-reply', result);
            }).catch((err) => {
                console.error('Error while updating document: ', err);
            });
        }).catch((err) => {
            console.error('Error while getting document: ', err);
        });
    });

    ipcMain.on('delete-command', (event, arg) => {
        commandDB.get(arg).then((doc) => {
            commandDB.remove(doc).then((result) => {
                event.sender.send('delete-command-reply', result);
            }).catch((err) => {
                console.error('Error while deleting document: ', err);
            });
        }).catch((err) => {
            console.error('Error while getting document: ', err);
        });
    });

    ipcMain.on('get-attachments', (event, arg) => {
        attachmentDB.allDocs({include_docs: true}).then((result) => {
            event.sender.send('get-attachments-reply', result.rows);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('get-attachment', (event, arg) => {
        attachmentDB.get(arg).then((result) => {
            event.sender.send('get-attachment-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('add-attachment', (event, arg) => {
        attachmentDB.put(arg).then((result) => {
            event.sender.send('add-attachment-reply', result);
        }).catch((err) => {
            console.log(err);
        });
    });

    ipcMain.on('update-attachment', (event, arg) => {
        attachmentDB.get(arg._id).then((doc) => {
            // Merge existing fields with updated fields and retain _rev
            let updatedDoc = {...doc, ...arg};

            attachmentDB.put(updatedDoc).then((result) => {
                event.sender.send('update-attachment-reply', result);
            }).catch((err) => {
                console.error('Error while updating document: ', err);
            });
        }).catch((err) => {
            console.error('Error while getting document: ', err);
        });
    });

    ipcMain.on('delete-attachment', (event, arg) => {
        attachmentDB.get(arg).then((doc) => {
            attachmentDB.remove(doc).then((result) => {
                event.sender.send('delete-attachment-reply', result);
            }).catch((err) => {
                console.error('Error while deleting document: ', err);
            });
        }).catch((err) => {
            console.error('Error while getting document: ', err);
        });
    });

    ipcMain.on('clear-data', (event, arg) => {
        constructDB.destroy();
        chatsDB.destroy();
        commandDB.destroy();
        attachmentDB.destroy();
        createDBs();
    });

    function createDBs (){
        constructDB = new PouchDB('constructs', {prefix: dataPath});
        chatsDB = new PouchDB('chats', {prefix: dataPath});
        commandDB = new PouchDB('commands', {prefix: dataPath});
        attachmentDB = new PouchDB('attachments', {prefix: dataPath});
        instructDB = new PouchDB('instructs', {prefix: dataPath});
    }

    return {
        constructDB,
        chatsDB,
        commandDB,
        attachmentDB,
        instructDB
    }
};