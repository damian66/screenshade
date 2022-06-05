const { app, Menu, MenuItem, Tray, BrowserWindow, globalShortcut, nativeImage } = require('electron');
const path = require('path');
const osxBrightness = require('osx-brightness');

class ShaderNativeTray {
  enabled = false;
  opacity = 0.5;

  // TODO Save settings
  showPercentage = false;

  // Opacity predefined levels
  levels = [0.2, 0.35, 0.5, 0.65, 0.8];
  // Increase/decrease opacity step
  step = 0.1;

  shortcuts = [
    { key: 'TOGGLE', accelerator: 'Ctrl+Cmd+S', handler: () => this.toggle() },
    { key: 'INCREASE_OPACITY', accelerator: 'Ctrl+Cmd+.', handler: () => this.increaseOpacity() },
    { key: 'DECREASE_OPACITY', accelerator: 'Ctrl+Cmd+,', handler: () => this.decreaseOpacity() },
    { key: 'SET_OPACITY_1', accelerator: 'Ctrl+Cmd+1', handler: () => this.show(this.levels[0]) },
    { key: 'SET_OPACITY_2', accelerator: 'Ctrl+Cmd+2', handler: () => this.show(this.levels[1]) },
    { key: 'SET_OPACITY_3', accelerator: 'Ctrl+Cmd+3', handler: () => this.show(this.levels[2]) },
    { key: 'SET_OPACITY_4', accelerator: 'Ctrl+Cmd+4', handler: () => this.show(this.levels[3]) },
    { key: 'SET_OPACITY_5', accelerator: 'Ctrl+Cmd+5', handler: () => this.show(this.levels[4]) },
    { key: 'SET_OPACITY_0', accelerator: 'Ctrl+Cmd+0', handler: () => this.enabled && this.toggle() },
  ];

  getIcon(name) {
    return nativeImage.createFromPath(path.join(__dirname, "assets", name));
  }

  getOpacityLabel(amount) {
    return `${amount * 100}%`;
  }
  
  getTrayIcon() {
    if (this.opacity < this.levels[0] || !this.enabled) return this.getIcon('sunny-snowing-Template.png');
    else if (this.opacity >= this.levels[4]) return this.getIcon('brightness-5-Template.png');
    else if (this.opacity >= this.levels[3]) return this.getIcon('brightness-4-Template.png');
    else if (this.opacity >= this.levels[2]) return this.getIcon('brightness-3-Template.png');
    else if (this.opacity >= this.levels[1]) return this.getIcon('brightness-2-Template.png');
    else if (this.opacity >= this.levels[0]) return this.getIcon('brightness-1-Template.png');
    else return this.getIcon('brightness-1-Template.png');
  }

  constructor() {
    // this.tray = new Tray(this.getIcon('tray-Template.png'));
    this.tray = new Tray(this.getIcon('tray-Template.png'));

    this.initializeShade();
    this.initializeTray();
    this.registerShortcuts();
  }

  getShadeBackgroundColor() {
    return `rgba(0, 0, 0, ${this.opacity})`;
  }

  getShortcutAccelerator(key) {
    return this.shortcuts.find(shortcut => shortcut.key === key)?.accelerator;
  }

  toggle() {
    if (this.enabled) {
      this.shade.hide();
      this.enabled = false;
    } else {

      this.show(this.opacity);
    }

    this.initializeTray();
  }

  increaseOpacity() {
    const lastOpacityLevel = this.levels[this.levels.length - 1];

    if (this.opacity <= lastOpacityLevel - this.step) {
      // Handling the JavaScript floating point precision issue
      // 0.35 + 0.1 results with 0.44
      this.opacity = ((this.opacity * 100) + (this.step * 100)) / 100;
    } else {
      this.opacity = lastOpacityLevel;
    }

    this.refreshBackground();
    this.initializeTray();
  }

  decreaseOpacity() {
    if (this.opacity >= this.levels[0] + this.step) {
      // See increaseOpacity method
      this.opacity = ((this.opacity * 100) - (this.step * 100)) / 100;
    } else {
      this.opacity = this.levels[0];
    }

    this.refreshBackground();
    this.initializeTray();
  }

  show(value) {
    this.opacity = value || this.opacity;
    this.refreshBackground();

    this.shade.showInactive();
    this.enabled = true;

    this.initializeTray();
  }

  refreshBackground() {
    this.shade.setBackgroundColor(this.getShadeBackgroundColor());
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
    this.tray.setImage(this.getTrayIcon());

    if (this.showPercentage) {
      const title = this.enabled ? Math.floor(this.opacity * 100) : 0;
      this.tray.setTitle(`${title}%`, { fontType: 'monospacedDigit' });
    } else {
      this.tray.setTitle('');
    }

    const menuTemplate = [
      {
        // label: this.enabled ? 'Disable' : 'Enable',
        label: 'Enable',
        checked: this.enabled,
        type: 'checkbox',
        accelerator: this.getShortcutAccelerator('TOGGLE'),
        icon: this.getIcon('sunny-snowing-Template.png'),
        click: () => this.toggle()
      },

      { type: 'separator' },

      {
        label: 'Increase Opacity',
        accelerator: this.getShortcutAccelerator('INCREASE_OPACITY'),
        click: () => this.increaseOpacity(),
        enabled: this.enabled && this.opacity <= this.levels[this.levels.length - 1] - this.step,
      },
      {
        label: 'Decrease Opacity',
        accelerator: this.getShortcutAccelerator('DECREASE_OPACITY'),
        click: () => this.decreaseOpacity(),
        enabled: this.enabled && this.opacity >= this.levels[0] + this.step, // TODO Use custom levels
      },

      { type: 'separator' },

      {
        label: this.getOpacityLabel(this.levels[4]),
        click: () => this.show(this.levels[4]),
        type: 'checkbox',
        icon: this.getIcon('brightness-5-Template.png'),
        accelerator: this.getShortcutAccelerator('SET_OPACITY_5'),
        checked: this.enabled && this.opacity === this.levels[4],
      },
      {
        label: this.getOpacityLabel(this.levels[3]),
        click: () => this.show(this.levels[3]),
        type: 'checkbox',
        icon: this.getIcon('brightness-4-Template.png'),
        accelerator: this.getShortcutAccelerator('SET_OPACITY_4'),
        checked: this.enabled && this.opacity === this.levels[3],
      },
      {
        label: this.getOpacityLabel(this.levels[2]),
        click: () => this.show(this.levels[2]),
        type: 'checkbox',
        icon: this.getIcon('brightness-3-Template.png'),
        accelerator: this.getShortcutAccelerator('SET_OPACITY_3'),
        checked: this.enabled && this.opacity === this.levels[2],
      },
      {
        label: this.getOpacityLabel(this.levels[1]),
        click: () => this.show(this.levels[1]),
        type: 'checkbox',
        icon: this.getIcon('brightness-2-Template.png'),
        accelerator: this.getShortcutAccelerator('SET_OPACITY_2'),
        checked: this.enabled && this.opacity === this.levels[1],
      },
      {
        label: this.getOpacityLabel(this.levels[0]),
        click: () => this.show(this.levels[0]),
        type: 'checkbox',
        icon: this.getIcon('brightness-1-Template.png'),
        accelerator: this.getShortcutAccelerator('SET_OPACITY_1'),
        checked: this.enabled && this.opacity === this.levels[0],
      },

      { type: 'separator' },
      
      {
        label: 'Show percentage',
        click: () => {
          this.showPercentage = !this.showPercentage;
          this.initializeTray();
        },
        type: 'checkbox',
        checked: this.showPercentage,
      },

      { type: 'separator' },

      {
        role: 'quit',
        click: () => {
          app.quit();
        },
      },
    ];

    const trayMenu = Menu.buildFromTemplate(menuTemplate);

    this.tray.setContextMenu(trayMenu);
  }

  registerShortcuts() {
    this.shortcuts.forEach(shortcut => {
      const command = typeof shortcut.accelerator === 'string' ? 'register' : 'registerAll';
      globalShortcut[command](shortcut.accelerator, shortcut.handler);
    });
  }
}

module.exports = ShaderNativeTray;
