// main.js
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

// expose version to renderer
ipcMain.handle('get-app-version', () => app.getVersion());

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (!mainWindow) createWindow();
});

// ── in-app update handlers ───────────────────────────────────────

autoUpdater.on('update-available', info => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update available',
    message: `Version ${info.version} is available. Downloading now…`
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Restart and install', 'Later'],
    defaultId: 0,
    message: 'Update downloaded—restart now to install?'
  }).then(({ response }) => {
    if (response === 0) autoUpdater.quitAndInstall();
  });
});

autoUpdater.on('error', err => {
  console.error('Update error:', err);
});
