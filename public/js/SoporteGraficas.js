var socket = io();

var params = new URLSearchParams(window.location.search);

socket.on('connect', function () {
    console.log('Conectado');
});

// escuchar
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

