const { ipcRenderer, contextBridge } = require('electron');
const {
  parse,
  milliseconds,
  getMinutes,
  getSeconds,
  getHours
} = require('date-fns');

function init() {
  contextBridge.exposeInMainWorld('electron', {
    getBreakContent: elementId =>
      ipcRenderer.invoke('get-body').then(result => {
        document.getElementById(elementId).innerHTML = result;
      }),
    openBreakWindow: currentTimer =>
      ipcRenderer.send('open-break', currentTimer),
    closeBreakWindow: () => ipcRenderer.send('close-break'),
    exitApp: () => ipcRenderer.send('exit-app'),
    minimizeMain: () => ipcRenderer.send('minimize-main'),
  });
  contextBridge.exposeInMainWorld('isElectron', true);
  contextBridge.exposeInMainWorld('dateFns', {
    convertToMilliseconds: timeString => {
      const dateObject = parse(timeString, 'HH:mm:ss', new Date());
      const hours = getHours(dateObject);
      const minutes = getMinutes(dateObject);
      const seconds = getSeconds(dateObject);
      return milliseconds({ hours, minutes, seconds });
    }
  });
}

init();
