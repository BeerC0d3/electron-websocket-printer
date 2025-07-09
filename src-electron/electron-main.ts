import { app, BrowserWindow, ipcMain } from 'electron';
//const { fork } = require('child_process');
// import { ChildProcess } from 'child_process';

import path from 'path';
import os from 'os';

require('./server.js');
// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow: BrowserWindow | undefined;
//let serverProcess: ChildProcess;

function createWindow() {
  /**
   * Initial window options
   */
  console.log('createWindow');
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(() => {
  console.log('whenReady');
  //console.log(path.join(__dirname, 'server.js'));
  // Iniciar el servidor Node.js
  //fork(path.join(__dirname, 'server.js'));
  // Manejar el cierre del servidor cuando la app se cierre
  // app.on('will-quit', () => {
  //   serverProcess.kill();
  // });

  createWindow();

  app.on('activate', () => {
    if (mainWindow === undefined) {
      console.log('activate');
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    console.log('window-all-closed');
    app.quit();
  }
});

// app.on('activate', () => {
//   if (mainWindow === undefined) {
//     console.log('activate');
//     createWindow();
//   }
// });

// Manejar mensajes del proceso de renderizado
ipcMain.on('get-data', (event) => {
  // Enviar una solicitud al servidor y responder al proceso de renderizado
  fetch('http://localhost:3000')
    .then((response) => response.text())
    .then((data) => {
      console.log('aqui chingaos');
      event.reply('data-received', data);
    });
});
