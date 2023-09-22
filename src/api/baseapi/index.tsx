import axios from 'axios';

export async function getBackgrounds(): Promise<any[]> {
    return axios.get(`/api/get-backgrounds`)
        .then(response => response.data.files)
        .catch(error => {
            throw error.response.data.error;
        });
}

export async function deleteBackground(filename: string): Promise<{ success: boolean }> {
    return axios.delete(`/api/delete-background/${filename}`)
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

            axios.post(`/api/save-background`, {
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
    axios.post('/api/images/upload', formData, {
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