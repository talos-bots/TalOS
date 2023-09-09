import { ipcRenderer } from "electron";
export type ImageReply = {
    name: string,
    base64: string
    model: string
}
export const sendTxt2Img = (
    prompt: string, negativePrompt?: string, steps?: number, cfg?: number, width?: number, height?: number, highresSteps?: number, denoisingStrength?: number
): Promise<ImageReply | null> => { 
    return new Promise((resolve, reject) => {
        ipcRenderer.send('txt2img', prompt, negativePrompt, steps, cfg, width, height, highresSteps, denoisingStrength);
        
        ipcRenderer.once('txt2img-reply', (event, result) => {
            resolve(result);
        });
    });
}

export const setSDAPIUrl = (url: string): void => {
    ipcRenderer.send('set-sdapi-url', url);
}

export const getSDAPIUrl = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-sdapi-url');
        
        ipcRenderer.once('get-sdapi-url-reply', (event, result) => {
            console.log(result);
            resolve(result);
        });
    });
}

export const getDefaultUpscaler = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-default-upscaler');
        
        ipcRenderer.once('get-default-upscaler-reply', (event, result) => {
            resolve(result);
        });
    });
}

export const setDefaultUpscaler = (upscaler: string): void => {
    ipcRenderer.send('set-default-upscaler', upscaler);
}

export const getLoras = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-loras');
        
        ipcRenderer.once('get-loras-reply', (event, result) => {
            resolve(result);
        });
    });
}

export const getEmbeddings = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-embeddings');
        
        ipcRenderer.once('get-embeddings-reply', (event, result) => {
            resolve(result);
        });
    });
}

export const getModels = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-models');
        
        ipcRenderer.once('get-models-reply', (event, result) => {
            resolve(result);
        });
    });
}

export const getVaeModels = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-vae-models');
        
        ipcRenderer.once('get-vae-models-reply', (event, result) => {
            resolve(result);
        });
    });
}

export const getUpscalers = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-upscalers');
        
        ipcRenderer.once('get-upscalers-reply', (event, result) => {
            resolve(result);
        });
    });
}

export const getDefaultSteps = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-default-steps');

        ipcRenderer.once('get-default-steps-reply', (event, result) => {
            resolve(result);
        });
    });
};

export const setDefaultSteps = (steps: number): void => {
    ipcRenderer.send('set-default-steps', steps);
};

export const getDefaultCfg = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-default-cfg');

        ipcRenderer.once('get-default-cfg-reply', (event, result) => {
            resolve(result);
        });
    });
};

export const setDefaultCfg = (cfg: string): void => {
    ipcRenderer.send('set-default-cfg', cfg);
};

export const getDefaultWidth = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-default-width');

        ipcRenderer.once('get-default-width-reply', (event, result) => {
            resolve(result);
        });
    });
};

export const setDefaultWidth = (width: number): void => {
    ipcRenderer.send('set-default-width', width);
};

export const getDefaultHeight = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-default-height');

        ipcRenderer.once('get-default-height-reply', (event, result) => {
            resolve(result);
        });
    });
};

export const setDefaultHeight = (height: number): void => {
    ipcRenderer.send('set-default-height', height);
};

export const getDefaultHighresSteps = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-default-highres-steps');

        ipcRenderer.once('get-default-highres-steps-reply', (event, result) => {
            resolve(result);
        });
    });
};

export const setDefaultHighresSteps = (highresSteps: number): void => {
    ipcRenderer.send('set-default-highres-steps', highresSteps);
};

export const getDefaultDenoisingStrength = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-default-denoising-strength');

        ipcRenderer.once('get-default-denoising-strength-reply', (event, result) => {
            resolve(result);
        });
    });
};

export const setDefaultDenoisingStrength = (denoisingStrength: number): void => {
    ipcRenderer.send('set-default-denoising-strength', denoisingStrength);
};

export const getDefaultUpscale = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-default-upscale');

        ipcRenderer.once('get-default-upscale-reply', (event, result) => {
            resolve(result);
        });
    });
};

export const setDefaultUpscale = (denoisingStrength: number): void => {
    ipcRenderer.send('set-default-upscale', denoisingStrength);
};

export const setDefaultNegativePrompt = (negativePrompt: string): void => {
    ipcRenderer.send('set-default-negative-prompt', negativePrompt);
}

export const getDefaultNegativePrompt = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-default-negative-prompt');

        ipcRenderer.once('get-default-negative-prompt-reply', (event, result) => {
            resolve(result);
        });
    });
};

export const setDefaultPrompt = (positivePrompt: string): void => {
    ipcRenderer.send('set-default-prompt', positivePrompt);
}

export const getDefaultPrompt = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-default-prompt');

        ipcRenderer.once('get-default-prompt-reply', (event, result) => {
            resolve(result);
        });
    });
};