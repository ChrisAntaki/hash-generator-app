var ipc = require('ipc');

function $ (query, callback) {
    var elements = document.querySelectorAll(query);

    if (!callback) {
        return Array.prototype.slice.apply(elements);
    }

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        callback.apply(element, [element, i]);
    }
}

$('a.next', function() {
    this.addEventListener('click', function(e) {
        ipc.send('Select source file');
    }, false);
});

$('a.another', function() {
    this.addEventListener('click', function(e) {
        changePhase('hello');
    }, false);
});

ipc.on('Change phase', changePhase);

function changePhase(phase) {
    $('.phase', function() {
        this.style.display = 'none';
    });

    $('.phase-' + phase, function() {
        this.style.display = 'block';
    });
}
