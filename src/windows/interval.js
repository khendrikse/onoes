const { BrowserWindow } = require('electron');
const path = require('path');

const intervalWindow = () => {
  const window = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload.js')
    }
  });

  window.webContents.openDevTools();
  window.loadURL(`file://${__dirname}/../../html/intervalWindow.html`);
  return window;
};

module.exports = intervalWindow;
