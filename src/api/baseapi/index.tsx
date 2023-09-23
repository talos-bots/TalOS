import { url } from '@/App';
import { sendDesktopNotification } from '@/components/desktop-notification';
import axios from 'axios';

export async function getBackgrounds(): Promise<any[]> {
    return axios.get(`${url}/api/get-backgrounds`)
        .then(response => response.data.files)
        .catch(error => {
            throw error.response.data.error;
        });
}

export async function deleteBackground(filename: string): Promise<{ success: boolean }> {
    return axios.delete(`${url}/api/delete-background/${filename}`)
        .then(response => response.data)
        .catch(error => {
            throw error.response.data.error;
        });
}

export function saveBackground(file: File): Promise<string> {
    const name = file.name;
    const fileType = name.split('.').pop();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = () => {
            const base64String = reader.result as string;
            const imageData = base64String.split(',')[1];

            axios.post(`${url}/api/save-background`, {
                imageData: imageData,
                name: name,
                fileType: fileType
            })
            .then(response => {
                resolve(response.data.fileName);
            })
            .catch(error => {
                reject(error.response.data.error);
            });
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
}

export function uploadImage(formData: FormData): void {
    axios.post(`${url}/api/images/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log('Upload successful:', response.data);
    })
    .catch(error => {
      console.error('Error uploading:', error);
    });
}

export async function loadModels(){
    return axios.post(`${url}/api/models/load`).then((response) => {
      sendDesktopNotification('ConstructOS', 'Models Loaded');
    }).catch((err) => {
      console.error(err);
    });
}

export function getImageURL(filename: string): string {
    // Check if it is Base64
    if (filename.startsWith('data:image')) {
        return filename;
    }
    if(filename.startsWith('http')) return filename;
    return `${url}${filename}`;
}