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

ipc.on('Change phase', function(arg) {
    $('.phase', function() {
        this.style.display = 'none';
    });

    $('.phase-' + arg, function() {
        this.style.display = 'block';
    });
});
