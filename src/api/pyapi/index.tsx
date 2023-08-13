import axios from "axios";
const { ipcRenderer } = require("electron");
let SERVER_ENDPOINT = "";

// Fetch the port from the main process
ipcRenderer
  .invoke("get-server-port")
  .then((port) => {
    SERVER_ENDPOINT = `http://127.0.0.1:${port}`;
    console.log("Server endpoint set to:", SERVER_ENDPOINT);
  })
  .catch((error) => {
    console.error("Failed to get server port from main process:", error);
  });
type ZeroMessagePayload = {
  message: string;
};

export const sendZeroMessage = (
  data: ZeroMessagePayload,
  endpoint: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(endpoint);
      console.log(data);
      const response = await axios.post(
        SERVER_ENDPOINT + "/get_response",
        data
      );

      // This assumes the server sends back a structure with a response or error key
      if (response.data.error) {
        reject(response.data.error);
      } else {
        resolve(response.data.response);
      }
    } catch (error) {
      reject(error);
    }
  });
};
