const { app, BrowserWindow } = require('electron');
const path = require('path');
const ShaderNativeTray = require('./shader');

// Hide dock icon
app.dock.hide();

const createWindow = () => {
  const tray = new ShaderNativeTray();
};

app.on('ready', createWindow);

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
