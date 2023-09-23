import { url } from "@/App";
import axios from "axios";

export type ImageReply = {
    name: string,
    base64: string
    model: string
}
export const sendTxt2Img = async (
    prompt: string,
    negativePrompt?: string,
    steps?: number,
    cfg?: number,
    width?: number,
    height?: number,
    highresSteps?: number,
    denoisingStrength?: number
): Promise<ImageReply | null> => {
    try {
        const response = await axios.post(`${url}/api/diffusion/txt2img`, {
            data: {
                prompt,
                negativePrompt,
                steps,
                cfg,
                width,
                height,
                highresSteps,
                denoisingStrength
            }
        });

        return response.data.result;
    } catch (error) {
        console.error("Error sending txt2img:", error);
        return null;
    }
}

export const setSDAPIUrl = async (newURL: string): Promise<void> => {
    try {
        await axios.post(`${url}/api/diffusion/url`, { apiUrl: newURL });
    } catch (error) {
        console.error("Error setting SDAPI Url:", error);
    }
}

export const getSDAPIUrl = async (): Promise<string> => {
    try {
        const response = await axios.get(`${url}/api/diffusion/url`);
        const apiUrl: string = response.data.apiUrl;
        return apiUrl;
    } catch (error) {
        console.error("Error getting SDAPI Url:", error);
        return "";
    }
}

export const setDefaultNegativePrompt = async (negativePrompt: string): Promise<void> => {
    try {
        await axios.post(`${url}/api/diffusion/default-negative-prompt`, { prompt: negativePrompt });
    } catch (error) {
        console.error("Error setting default negative prompt:", error);
    }
}

export const getDefaultNegativePrompt = async (): Promise<string> => {
    try {
        const response = await axios.get(`${url}/api/diffusion/default-negative-prompt`);
        return response.data.prompt;
    } catch (error) {
        console.error("Error getting default negative prompt:", error);
        return "";
    }
};

export const setSDDefaultPrompt = async (positivePrompt: string): Promise<void> => {
    try {
        await axios.post(`${url}/api/diffusion/default-prompt`, { prompt: positivePrompt });
    } catch (error) {
        console.error("Error setting default prompt:", error);
    }
}

export const getDefaultPrompt = async (): Promise<string> => {
    try {
        const response = await axios.get(`${url}/api/diffusion/default-prompt`);
        return response.data.prompt;
    } catch (error) {
        console.error("Error getting default prompt:", error);
        return "";
    }
};

export const getDefaultUpscaler = async (): Promise<string> => {
    try {
        const response = await axios.get(`${url}/api/diffusion/default-upscaler`);
        return response.data.upscaler;
    } catch (error) {
        console.error("Error getting default upscaler:", error);
        return "";
    }
}

export const setDefaultUpscaler = async (upscaler: string): Promise<void> => {
    try {
        await axios.post(`${url}/api/diffusion/default-upscaler`, { upscaler });
    } catch (error) {
        console.error("Error setting default upscaler:", error);
    }
}

export const getUpscalers = async (): Promise<any> => {
    try {
        const response = await axios.get(`${url}/api/diffusion/upscalers`);
        return response.data.result;
    } catch (error) {
        console.error("Error getting upscalers:", error);
        throw error;
    }
}

export const getLoras = async (): Promise<any> => {
    try {
        const response = await axios.get(`${url}/api/diffusion/loras`);
        return response.data.result;
    } catch (error) {
        console.error("Error getting loras:", error);
        throw error;
    }
}

export const getEmbeddings = async (): Promise<any> => {
    try {
        const response = await axios.get(`${url}/api/diffusion/embeddings`);
        return response.data.result;
    } catch (error) {
        console.error("Error getting embeddings:", error);
        throw error;
    }
}

export const getModels = async (): Promise<any> => {
    try {
        const response = await axios.get(`${url}/api/diffusion/models`);
        return response.data.result;
    } catch (error) {
        console.error("Error getting models:", error);
        throw error;
    }
}

export const getVaeModels = async (): Promise<any> => {
    try {
        const response = await axios.get(`${url}/api/diffusion/vae-models`);
        return response.data.result;
    } catch (error) {
        console.error("Error getting VAE models:", error);
        throw error;
    }
}

export const getDefaultSteps = async (): Promise<number> => {
    const response = await axios.get(`${url}/api/diffusion/default-steps`);
    return response.data.steps;
};

export const setDefaultSteps = async (steps: number): Promise<void> => {
    await axios.post(`${url}/api/diffusion/default-steps`, { steps });
};

export const getDefaultCfg = async (): Promise<string> => {
    const response = await axios.get(`${url}/api/diffusion/default-cfg`);
    return response.data.cfg;
};

export const setDefaultCfg = async (cfg: string): Promise<void> => {
    await axios.post(`${url}/api/diffusion/default-cfg`, { cfg });
};

export const getDefaultWidth = async (): Promise<number> => {
    const response = await axios.get(`${url}/api/diffusion/default-width`);
    return response.data.width;
};

export const setDefaultWidth = async (width: number): Promise<void> => {
    await axios.post(`${url}/api/diffusion/default-width`, { width });
};

export const getDefaultHeight = async (): Promise<number> => {
    const response = await axios.get(`${url}/api/diffusion/default-height`);
    return response.data.height;
};

export const setDefaultHeight = async (height: number): Promise<void> => {
    await axios.post(`${url}/api/diffusion/default-height`, { height });
};

export const getDefaultHighresSteps = async (): Promise<number> => {
    const response = await axios.get(`${url}/api/diffusion/default-highres-steps`);
    return response.data.highresSteps;
};

export const setDefaultHighresSteps = async (highresSteps: number): Promise<void> => {
    await axios.post(`${url}/api/diffusion/default-highres-steps`, { highresSteps });
};

export const getDefaultDenoisingStrength = async (): Promise<number> => {
    const response = await axios.get(`${url}/api/diffusion/default-denoising-strength`);
    return response.data.denoisingStrength;
};

export const setDefaultDenoisingStrength = async (denoisingStrength: number): Promise<void> => {
    await axios.post(`${url}/api/diffusion/default-denoising-strength`, { denoisingStrength });
};

export const getDefaultUpscale = async (): Promise<number> => {
    const response = await axios.get(`${url}/api/diffusion/default-upscale`);
    return response.data.upscale;
};

export const setDefaultUpscale = async (upscale: number): Promise<void> => {
    await axios.post(`${url}/api/diffusion/default-upscale`, { upscale });
};