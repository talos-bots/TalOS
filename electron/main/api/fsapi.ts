import { ipcMain } from 'electron';
import fs from 'fs';

export function FsAPIRoutes() {
    // Read a file asynchronously
    ipcMain.handle('read-file', async (event, filePath: string) => {
        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            return data;
        } catch (err) {
            console.error(`Error reading file at ${filePath}:`, err);
            throw err;
        }
    });

    // Write to a file asynchronously
    ipcMain.handle('write-file', async (event, filePath: string, data: string) => {
        try {
            await fs.promises.writeFile(filePath, data, 'utf8');
            return { success: true };
        } catch (err) {
            console.error(`Error writing to file at ${filePath}:`, err);
            throw err;
        }
    });

    // Create a directory asynchronously
    ipcMain.handle('mkdir', async (event, dirPath: string) => {
        try {
            await fs.promises.mkdir(dirPath, { recursive: true }); // Recursive to ensure parent directories are created
            return { success: true };
        } catch (err) {
            console.error(`Error creating directory at ${dirPath}:`, err);
            throw err;
        }
    });

    // Read the contents of a directory asynchronously
    ipcMain.handle('readdir', async (event, dirPath: string) => {
        try {
            const files = await fs.promises.readdir(dirPath);
            return files;
        } catch (err) {
            console.error(`Error reading directory at ${dirPath}:`, err);
            throw err;
        }
    });

    // Rename a file or directory
    ipcMain.handle('rename', async (event, oldPath: string, newPath: string) => {
        try {
            await fs.promises.rename(oldPath, newPath);
            return { success: true };
        } catch (err) {
            console.error(`Error renaming from ${oldPath} to ${newPath}:`, err);
            throw err;
        }
    });

    // Remove a file
    ipcMain.handle('unlink', async (event, filePath: string) => {
        try {
            await fs.promises.unlink(filePath);
            return { success: true };
        } catch (err) {
            console.error(`Error removing file at ${filePath}:`, err);
            throw err;
        }
    });

    // Check if a file or directory exists
    ipcMain.handle('exists', (event, path: string) => {
        return fs.existsSync(path);  // Using synchronous version directly as it's a simple check
    });

    // Get information about a file or directory
    ipcMain.handle('stat', async (event, filePath: string) => {
        try {
            const stats = await fs.promises.stat(filePath);
            return stats;
        } catch (err) {
            console.error(`Error getting stats for file at ${filePath}:`, err);
            throw err;
        }
    });

    // Copy a file
    ipcMain.handle('copy-file', async (event, src: string, dest: string, flags?: number) => {
        try {
            await fs.promises.copyFile(src, dest, flags);
            return { success: true };
        } catch (err) {
            console.error(`Error copying file from ${src} to ${dest}:`, err);
            throw err;
        }
    });

    // Open a file
    ipcMain.handle('open-file', async (event, path: string, flags: string, mode?: number) => {
        try {
        const fd = await fs.promises.open(path, flags, mode);
        return fd.fd;  // Return the file descriptor number
        } catch (err) {
        console.error(`Error opening file at ${path}:`, err);
        throw err;
        }
    });
}