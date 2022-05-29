const { app, Menu, MenuItem, Tray, BrowserWindow } = require('electron');
const osxBrightness = require('osx-brightness');

class ShaderNativeTray {
  enabled = false;
  opacity = 0.5;

  constructor() {
    this.tray = new Tray('./src/assets/tray-Template.png');

    this.initializeShade();
    this.initializeTray();
  }

  getShadeBackgroundColor() {
    return `rgba(0, 0, 0, ${this.opacity})`;
  }

  increaseOpacity() {
    if (this.opacity <= 0.8) {
      this.opacity += 0.1;
    } else {
      this.opacity = 0.9;
    }

    this.refreshBackground();
  }

  decreaseOpacity() {
    if (this.opacity >= 0.2) {
      this.opacity -= 0.1;
    } else {
      this.opacity = 0.1;
    }

    this.refreshBackground();
  }

  setOpacity(value) {
    this.opacity = value;
    this.refreshBackground();

    this.shade.show();
    this.enabled = true;

    this.initializeTray();
  }

  refreshBackground() {
    this.shade.setBackgroundColor(this.getShadeBackgroundColor());
  }
  
  toggle() {
    if (this.enabled) {
      this.shade.hide();
      this.enabled = false;
    } else {
      this.shade.show();
      this.enabled = true;
    }

    this.initializeTray();
  }

  initializeShade() {
    this.shade = new BrowserWindow({
      alwaysOnTop: true,
      backgroundColor: this.getShadeBackgroundColor(),
      frame: false,
      hasShadow: false,
      roundedCorners: false,
      x: 0,
      y: 0,
      simpleFullscreen: true,
      type: 'desktop',
      transparent: true,
      show: false,
      skipTaskbar: true,
    });

    this.shade.maximize();
    this.shade.setIgnoreMouseEvents(true);
    this.shade.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
    this.shade.setAlwaysOnTop(true, { level: 'screen-saver', relativeLevel: 1 });
    this.shade.setSimpleFullScreen(true);
  }

  initializeTray() {
    const menuTemplate = [
      {
        label: this.enabled ? 'Disable' : 'Enable',
        checked: this.enabled,
        type: 'checkbox',
        icon: './src/assets/sunny-snowing-Template.png',
        click: () => this.toggle()
      },

      { type: 'separator' },

      {
        label: 'Increase Opacity',
        accelerator: 'Alt+Cmd+.',
        click: () => this.increaseOpacity(),
        enabled: this.enabled
      },
      {
        label: 'Decrease Opacity',
        accelerator: 'Alt+Cmd+,',
        click: () => this.decreaseOpacity(),
        enabled: this.enabled
      },

      { type: 'separator' },

      {
        label: '90%',
        click: () => this.setOpacity(0.90),
        type: 'checkbox',
        icon: './src/assets/brightness-5-Template.png',
        checked: this.enabled && this.opacity === 0.90,
      },
      {
        label: '75%',
        click: () => this.setOpacity(0.75),
        type: 'checkbox',
        icon: './src/assets/brightness-4-Template.png',
        checked: this.enabled && this.opacity === 0.75,
      },
      {
        label: '50%',
        click: () => this.setOpacity(0.5),
        type: 'checkbox',
        icon: './src/assets/brightness-3-Template.png',
        checked: this.enabled && this.opacity === 0.5,
      },
      {
        label: '25%',
        click: () => this.setOpacity(0.25),
        type: 'checkbox',
        icon: './src/assets/brightness-2-Template.png',
        checked: this.enabled && this.opacity === 0.25,
      },
      {
        label: '10%',
        click: () => this.setOpacity(0.1),
        type: 'checkbox',
        icon: './src/assets/brightness-1-Template.png',
        checked: this.enabled && this.opacity === 0.1,
      },

      { type: 'separator' },

      {
        label: 'Quit',
        accelerator: 'Alt+Cmd+I',
        role: 'quit',
        click: () => {
          app.quit();
        },
      },
    ];

    const trayMenu = Menu.buildFromTemplate(menuTemplate);

    this.tray.setContextMenu(trayMenu);
  }
}

module.exports = ShaderNativeTray;
