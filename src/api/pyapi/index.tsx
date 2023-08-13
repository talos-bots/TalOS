import { ipcRenderer } from "electron";

type ZeroMessagePayload = {
  message: string;
};

export const sendZeroMessage = (
  data: ZeroMessagePayload,
  endpoint: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log(endpoint);
    console.log(data);
    ipcRenderer.send("zero-message", data, endpoint);

    ipcRenderer.once("zero-message-reply", (event, result) => {
      if (result.error) {
        reject(result.error);
      } else {
        resolve(result.response);
      }
    });
  });
};
