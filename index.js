'use strict';

const app = require('app'); // Module to control application life.
const BrowserWindow = require('browser-window'); // Module to create native browser window.
const crypto = require('crypto');
const dialog = require('dialog');
const fs = require('fs');
const ipc = require('ipc');
const shell = require('shell');

// // Report crashes to our server.
// require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        'height': 600,
        'min-width': 320,
        'width': 800,
    });

    mainWindow.setMenu(null);

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/public/index.html');

    // // Open the devtools.
    // mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    ipc.on('Select source file', function(e, arg) {
        let paths = dialog.showOpenDialog({
            title: 'Choose a list',
            properties: ['openFile']
        });

        if (!paths) {
            return;
        }

        e.sender.send('Change phase', 'wait');

        setTimeout(function() {
            let data = fs.readFileSync(paths[0], 'utf-8');

            if (/,/.test(data)) {
                e.sender.send('Change phase', 'hello');
                e.sender.send('Alert',
`Oh no! In order to run properly, this application needs a CSV with only the email column.
Please remove every other column and try again.`
                );
                return;
            }

            let lines =
                data
                .replace(/"/g, '')
                .replace(/\r/g, '\n')
                .replace(/\n\n/g, '\n')
                .split('\n')
                .map(function(line) {
                    line = line
                        .trim()
                        .toUpperCase();

                    return crypto
                        .createHash('md5')
                        .update(line)
                        .digest('hex');
                });

            let newPath = paths[0] + '.hashed.csv';
            fs.writeFile(newPath, lines.join('\n'), function() {
                e.sender.send('Change phase', 'goodbye');

                shell.showItemInFolder(newPath);
            });

        }, 500);

    });

});
