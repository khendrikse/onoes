const { BrowserWindow } = require('electron');
const path = require('path');

const menuWindow = () => {
  const window = new BrowserWindow({
    width: 500,
    height: 850,
    frame: false,
    hasShadow: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload.bundle.js')
    }
  });

  window.loadURL(`file://${__dirname}/../../html/menuWindow.html`);
  return window;
};

module.exports = menuWindow;
