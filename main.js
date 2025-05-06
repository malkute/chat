// main.js
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

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

  // Point to public/index.html inside the ASAR
  mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));

  // mainWindow.webContents.openDevTools(); // uncomment to debug
}

app.whenReady().then(() => {
  createWindow();
  // auto-check & notify on updates
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (!mainWindow) createWindow();
});

// ─── electron-updater events ──────────────────────────────────────────

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
