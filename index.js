var app = require('app'); // Module to control application life.
var BrowserWindow = require('browser-window'); // Module to create native browser window.
var crypto = require('crypto');
var dialog = require('dialog');
var fs = require('fs');
var ipc = require('ipc');
var shell = require('shell');

// // Report crashes to our server.
// require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

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
        var paths = dialog.showOpenDialog({
            title: 'Choose a list',
            properties: ['openFile']
        });

        if (!paths) {
            return;
        }

        e.sender.send('Change phase', 'wait');

        setTimeout(function() {
            var lines =
                fs.readFileSync(paths[0], 'utf-8')
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

            var newPath = paths[0] + '.hashed.csv';
            fs.writeFile(newPath, lines.join('\n'), function() {
                e.sender.send('Change phase', 'goodbye');

                shell.showItemInFolder(newPath);

                setTimeout(process.exit, 5000);
            });

        }, 500);

    });

});
