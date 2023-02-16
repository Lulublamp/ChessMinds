// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from 'electron';

const CLIENT_API = {
    test: 'Client Side'
};

type ClientApi = typeof CLIENT_API;

//exposition de l'api client pour l'application front
contextBridge.exposeInMainWorld('client' , CLIENT_API);

export default ClientApi;