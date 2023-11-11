import PouchDB from 'pouchdb';
import { dataPath, expressApp, isDarwin } from '../server';
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
        return user;
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

    expressApp.post('/api/constructs/add/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const construct = req.body;
            construct._id = id;
            const result = await addConstruct(construct); // Assuming addConstruct() is a function in your backend logic
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: "An error occurred while adding the construct." });
        }
    });
    
    expressApp.put('/api/update-construct/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const construct = req.body;
            construct._id = id;
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

    // Route for getting all commands
    expressApp.get('/api/commands', async (req, res) => {
        try {
            const result = await getAllCommands();
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to get commands.");
        }
    });

    // Route for getting a specific command by ID
    expressApp.get('/api/command/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const result = await getCommand(id);
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to get command.");
        }
    });

    // Route for adding a command
    expressApp.post('/api/command', async (req, res) => {
        try {
            const command = req.body.command;
            const result = await addCommand(command);
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to add command.");
        }
    });

    // Route for updating a command
    expressApp.put('/api/command', async (req, res) => {
        try {
            const command = req.body.command;
            const result = await updateCommand(command);
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to update command.");
        }
    });

    // Route for deleting a command by ID
    expressApp.delete('/api/command/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const result = await removeCommand(id);
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to delete command.");
        }
    });

    // Route for getting all attachments
    expressApp.get('/api/attachments', async (req, res) => {
        try {
            const result = await getAllAttachments();
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to get attachments.");
        }
    });

    // Route for getting a specific attachment by ID
    expressApp.get('/api/attachment/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const result = await getAttachment(id);
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to get attachment.");
        }
    });

    // Route for adding an attachment
    expressApp.post('/api/attachment', async (req, res) => {
        try {
            const attachment = req.body;
            const result = await addAttachment(attachment);
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to add attachment.");
        }
    });

    // Route for updating an attachment
    expressApp.put('/api/attachment/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const updatedData = req.body;
            const result = await updateAttachment(updatedData);
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to update attachment.");
        }
    });

    // Route for deleting an attachment by ID
    expressApp.delete('/api/attachment/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const result = await removeAttachment(id);
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to delete attachment.");
        }
    });

    expressApp.get('/api/instructs', async (req, res) => {
        try {
            const instructs = await getAllInstructs();
            res.json(instructs);
        } catch (error) {
            res.status(500).send({ error: 'Failed to get all instructs.' });
        }
    });
    
    expressApp.get('/api/instruct/:id', async (req, res) => {
        try {
            const instruct = await getInstruct(req.params.id);
            if (!instruct) {
                return res.status(404).send({ error: 'Instruct not found.' });
            }
            res.json(instruct);
        } catch (error) {
            res.status(500).send({ error: 'Failed to get instruct.' });
        }
    });
    
    expressApp.post('/api/instruct', async (req, res) => {
        try {
            const result = await addInstruct(req.body);
            res.json(result);
        } catch (error) {
            res.status(500).send({ error: 'Failed to add instruct.' });
        }
    });
    
    expressApp.put('/api/instruct/:id', async (req, res) => {
        try {
            const result = await updateInstruct(req.body);
            res.json(result);
        } catch (error) {
            res.status(500).send({ error: 'Failed to update instruct.' });
        }
    });
    
    expressApp.delete('/api/instruct/:id', async (req, res) => {
        try {
            const result = await removeInstruct(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(500).send({ error: 'Failed to delete instruct.' });
        }
    });

    // Route for getting all completions
    expressApp.get('/api/completions', async (req, res) => {
        try {
            const result = await getAllCompletions();
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to get completions.");
        }
    });

    // Route for getting a specific completion by ID
    expressApp.get('/api/completion/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const result = await getCompletion(id);
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to get completion.");
        }
    });

    // Route for adding a completion
    expressApp.post('/api/completion', async (req, res) => {
        try {
            const completion = req.body;
            const result = await addCompletion(completion);
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to add completion.");
        }
    });

    // Route for updating a completion
    expressApp.put('/api/completion/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const updatedData = req.body;
            const result = await updateCompletion(updatedData);
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to update completion.");
        }
    });

    // Route for deleting a completion by ID
    expressApp.delete('/api/completion/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const result = await removeCompletion(id);
            res.json(result);
        } catch (error) {
            res.status(500).send("Failed to delete completion.");
        }
    });

    // Get all users
    expressApp.get('/api/users', async (req, res) => {
        try {
            const users = await getUsers(); // Assuming getUsers is an async function that fetches all users
            res.json(users);
        } catch (error) {
            res.status(500).send('Error fetching users');
        }
    });

    // Get a single user by ID
    expressApp.get('/api/user/:id', async (req, res) => {
        try {
            const user = await getUser(req.params.id); // Assuming getUser fetches a user by ID
            if (user) {
                res.json(user);
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            res.status(500).send('Error fetching user');
        }
    });

    // Add a new user
    expressApp.post('/api/user', async (req, res) => {
        try {
            const user = req.body;
            const result = await addUser(user); // Assuming addUser adds a new user and returns the added user
            res.status(201).json(result);
        } catch (error) {
            res.status(500).send('Error adding user');
        }
    });

    // Update a user
    expressApp.put('/api/user/:id', async (req, res) => {
        try {
            const user = req.body;
            const result = await updateUser(user); // Assuming updateUser updates a user by ID
            if (result) {
                res.json(result);
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            res.status(500).send('Error updating user');
        }
    });

    // Delete a user
    expressApp.delete('/api/user/:id', async (req, res) => {
        try {
            const result = await removeUser(req.params.id); // Assuming removeUser deletes a user by ID
            if (result) {
                res.json(result);
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            res.status(500).send('Error deleting user');
        }
    });
    
    // GET all lorebooks
    expressApp.get('/api/lorebooks', async (req, res) => {
        try {
            const lorebooks = await getLorebooks();
            res.json(lorebooks);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch lorebooks.' });
        }
    });

    // GET a specific lorebook by ID
    expressApp.get('/api/lorebook/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const lorebook = await getLorebook(id);
            res.json(lorebook);
        } catch (error) {
            res.status(500).json({ error: `Failed to fetch lorebook with ID ${id}.` });
        }
    });

    // POST a new lorebook
    expressApp.post('/api/lorebook', async (req, res) => {
        try {
            const result = await addLorebook(req.body);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Failed to add lorebook.' });
        }
    });

    // PUT (update) an existing lorebook
    expressApp.put('/api/lorebook/:id', async (req, res) => {
        try {
            const result = await updateLorebook(req.body);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: `Failed to update lorebook with ID ${req.params.id}.` });
        }
    });

    // DELETE a lorebook
    expressApp.delete('/api/lorebook/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const result = await removeLorebook(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: `Failed to delete lorebook with ID ${id}.` });
        }
    });

    expressApp.delete('/api/clear-data', async (req, res) => {
        try {
            await constructDB.destroy();
            await chatsDB.destroy();
            await commandDB.destroy();
            await attachmentDB.destroy();
            await instructDB.destroy();
            await completionDB.destroy();
            await userDB.destroy();
            await lorebookDB.destroy();
    
            createDBs();
    
            res.status(200).send('Data cleared successfully.');
        } catch (error) {
            console.error("Error clearing data:", error);
            res.status(500).send('Failed to clear data.');
        }
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