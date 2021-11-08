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

app.enableSandbox();

app.on('ready', () => {
  createMainWindow();
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          `script-src 'self' 'unsafe-hashes'
          'sha256-dlqLO/aPZQY702bkfghdPs/6liMy4i+jVRC9qKD4RWc='
          'sha256-KSlr8C2cF0NuaaNzdEs9/ymW7Lj3qXio9aKUI1yeb3g='
          'sha256-za0D/Qdi12nMpDZMd3ch5PYo/k47UZzg7XA87LWNlcY='
          'sha256-2gGc1PPXLuk9xZ6lZXuAC2wDOzVuOkYEl9YkvI10zOY='
          'sha256-tuYq/jRl/+89o2obcTdcRLE45Nv2r40J+kJ0HgJegsM='
          'sha256-onPuynW7C0EwU3tad9L8KRadhdLjz4son1URYcG8kpI='
          'sha256-X6Y/kNvGCaTvZcwfsJOpAMcue0keOUuFBFLDxhUT9m0='`
        ]
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
