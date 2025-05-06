const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('env', {
  // ← replace EVERYTHING here with your live ngrok URL
  API_URL: 'https://60fd-88-222-88-58.ngrok-free.app',
  VERSION: '1.1.11'
});
