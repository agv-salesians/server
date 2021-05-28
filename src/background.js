'use strict'

const { app, protocol, BrowserWindow } = require('electron')
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const serialport = require('serialport')
const Readline = require('@serialport/parser-readline')
const isDevelopment = process.env.NODE_ENV !== 'production'

// -----------------------------------  COMS  -----------------------------------------

function connectedEvent(method, name) {
  clients.forEach(client => {
    client.emit('connected', {
      connected: connected,
      method: method,
      name: name
    })
  });
}

function disconnectedEvent() {
  clients.forEach(client => {
    client.emit('connected', {
      connected: 0,
      method: 0,
      name: null
    })
  });
}

let port = new serialport('awaiting', { autoOpen: false });
let method = 0;
let methodName = null;
let connected = false;
let selectedPort = null;
let ports = [];

function dataHandler(data) {
  var dataString = data.toString('utf8').replace('/\t/g', '').replace(/'/g, "\"");
  try {
    let parsed = JSON.parse(dataString);
    console.log(parsed)
    clients.forEach(client => {
      client.emit('speed', parsed.s)
    });
  } catch (error) {
    console.log({
      string: dataString,
      error: error.message
    })
  }
}

setInterval(() => {
  serialport.list().then(function (portsNew) {
    ports = []
    portsNew.forEach(element => {
      ports.push(element.path)
      if (selectedPort == null && element.serialNumber == '55736323939351C0C191') {
        selectedPort = element.path;
        connected = true;
        connectedEvent(0, selectedPort);
        method = 0;
        methodName = selectedPort;
        port = new serialport(selectedPort, {
          baudRate: 1000000,
        })
        const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
        parser.on('data', dataHandler)

      }
    });
    if (!ports.includes(selectedPort)) {
      selectedPort = null;
      if (connected) {
        connected = false;
        method = 0;
        methodName = null;
        port = new serialport('awaiting', { autoOpen: false })
        disconnectedEvent();
      }
    }
  });
}, 100);

// -------------------------- NATIVE DATA TO WEBVIEW ----------------------------------

let connectedClients = 0;

const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});
let clients = []
io.on('connection', client => {

  // connection handling
  connectedClients++;
  clients.forEach(element => {
    element.emit('connectedClients', connectedClients);
    element.emit('connected', {
      connected: connected,
      method: method,
      name: methodName
    })
  });
  clients.push(client);



  client.on('disconnect', () => {
    const index = clients.indexOf(client);
    if (index > -1) {
      clients.splice(index, 1);
    }
    connectedClients += -1;
  });
});
server.listen(3000);

// ----------------------------------- WINDOW -----------------------------------------

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    //if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}
app.allowRendererProcessReuse = false


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
