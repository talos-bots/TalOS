import { ipcRenderer } from 'electron';
import { Stats } from 'fs';

// Read a file asynchronously
async function readFile(filePath: string): Promise<string> {
    return ipcRenderer.invoke('read-file', filePath);
}

// Write to a file asynchronously
async function writeFile(filePath: string, data: string): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('write-file', filePath, data);
}

// Create a directory asynchronously
async function mkdir(dirPath: string): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('mkdir', dirPath);
}

// Read the contents of a directory asynchronously
async function readdir(dirPath: string): Promise<string[]> {
    return ipcRenderer.invoke('readdir', dirPath);
}

// Rename a file or directory
async function rename(oldPath: string, newPath: string): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('rename', oldPath, newPath);
}

// Remove a file
async function unlink(filePath: string): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('unlink', filePath);
}

// Check if a file or directory exists
async function exists(path: string): Promise<boolean> {
    return await ipcRenderer.invoke('exists', path);
}

// Get information about a file or directory
async function stat(filePath: string): Promise<Stats> {
    return ipcRenderer.invoke('stat', filePath);
}

// Copy a file
async function copyFile(src: string, dest: string, flags?: number): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('copy-file', src, dest, flags);
}

// Open a file
async function openFile(path: string, flags: string, mode?: number): Promise<number> {
    return ipcRenderer.invoke('open-file', path, flags, mode);
}

// Export all functions for use elsewhere in the renderer process
export {
    readFile,
    writeFile,
    mkdir,
    readdir,
    rename,
    unlink,
    exists,
    stat,
    copyFile,
    openFile
};
