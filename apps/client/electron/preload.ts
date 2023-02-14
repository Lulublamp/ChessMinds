// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

const CLIENT_API = {
    test: (message) => {
        ipcRenderer.send('test', message);
    }
};

contextBridge.exposeInMainWorld('client', {
    test: () => {
        console.log('Hello from main process via client API');
    }
});