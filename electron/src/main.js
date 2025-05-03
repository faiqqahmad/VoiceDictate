import { app, BrowserWindow, dialog } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { spawn } from 'child_process';
import which from 'which';
import fs from 'fs';
import test from 'node:test';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let server;
let model;
const scriptPath = path.join(__dirname, '../../../backend/src', 'index.js');
if (!fs.existsSync(scriptPath)) {
  console.error(`Backend script not found at: ${scriptPath}`);
}

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

app.whenReady().then(async () => {
  createWindow();
  
  try {
    const sourcePath = path.join(__dirname, '../../../model/venv/bin/activate')
    const source = spawn('source', sourcePath)
    console.log(sourcePath, 'this is the source path')
    const nodePath = await which('node');
    console.log(`Node.js found at: ${nodePath}`);
    
    console.log("Starting backend server...");
    console.log(`Script path: ${scriptPath}`);
    model = spawn('python3')
    
    server = spawn(nodePath, [scriptPath], {
      stdio: 'inherit',
      cwd: path.dirname(scriptPath),
      env: { ...process.env }  // Pass all environment variables
    });

    
    server.on('error', (err) => {
      console.error('Failed to start backend process:', err);
      dialog.showErrorBox(
        'Backend Error',
        `Failed to start backend process: ${err.message}`
      );
    });
    
    server.on('exit', (code, signal) => {
      console.log(`Backend process exited with code ${code} and signal ${signal}`);
    });
    
    console.log('Backend server started successfully');
  } catch (err) {
    console.error('Error finding node executable:', err);
    dialog.showErrorBox(
      'Node.js Not Found',
      'Could not find Node.js executable. Please make sure Node.js is installed and in your PATH.'
    );
  }

  // On macOS it's common to re-create a window in the app when the
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
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Clean up the server process when the app is quit
app.on('before-quit', () => {
  if (server) {
    console.log("Terminating backend server...");
    server.kill();
  }
});