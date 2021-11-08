const { app, ipcMain, session } = require('electron');
const menu = require('./windows/menu');
const interval = require('./windows/interval');

// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let intervalWindow;

function createMainWindow() {
  mainWindow = menu();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createMainWindow();
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["script-src 'self'"]
      }
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

let intervalContent = '';

ipcMain.on('open-break', (event, currentTimer) => {
  intervalContent = currentTimer.title;
  intervalWindow = interval();
  intervalWindow.on('closed', () => {
    intervalWindow = null;
  });
});

ipcMain.handle('get-body', async () => intervalContent);

ipcMain.on('close-break', () => {
  intervalWindow.close();
});

ipcMain.on('exit-app', () => {
  app.quit();
});

ipcMain.on('minimize-main', () => {
  mainWindow.minimize();
});
