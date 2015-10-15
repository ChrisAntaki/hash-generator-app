'use strict';

const ipc = require('ipc');

function $ (query, callback) {
    let elements = document.querySelectorAll(query);

    if (!callback) {
        return Array.prototype.slice.apply(elements);
    }

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        callback.apply(element, [element, i]);
    }
}

$('a.next', function() {
    this.addEventListener('click', (e) => {
        ipc.send('Select source file');
    }, false);
});

$('a.another', function() {
    this.addEventListener('click', (e) => {
        changePhase('hello');
    }, false);
});

ipc.on('Change phase', changePhase);

ipc.on('Alert', (message) => {
    alert(message);
});

function changePhase(phase) {
    $('.phase', function() {
        this.style.display = 'none';
    });

    $('.phase-' + phase, function() {
        this.style.display = 'block';
    });
}
