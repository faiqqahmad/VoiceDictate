process.env.PATH += ':/opt/homebrew/bin:/usr/local/bin';

const fs = require('fs');
let nodePath = '/usr/local/bin/node';

if (!fs.existsSync(nodePath)) {
  nodePath = '/opt/homebrew/bin/node';
}

if (!fs.existsSync(nodePath)) {
  throw new Error('Node binary not found. Please install Node in a system-wide location.');
}

console.log('Checking nodePath:', nodePath);
console.log('Exists?', fs.existsSync(nodePath));
console.log('PATH in Electron:', process.env.PATH);

import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import {spawn} from 'child_process'
import which from 'which'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}
let server;
const scriptPath = path.join(__dirname, '../../backend/src', 'index.js')
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  console.log("before spawning server")
  server = spawn(nodePath, [scriptPath], {
    stdio: 'inherit',
    cwd: path.dirname(scriptPath)
  })
  console.log(process.argv, 'this is process.argv')
  console.log(scriptPath, 'this is the script path')
  console.log('server has spawned')
  // console.log("spawning server")
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (server) {
    server.kill()
    console.log("killing child")
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
