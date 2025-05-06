// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('env', {
  API_URL: 'https://60fd-88-222-88-58.ngrok-free.app',
  getVersion: () => ipcRenderer.invoke('get-app-version')
});
