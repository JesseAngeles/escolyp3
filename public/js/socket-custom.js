var socket = io();

socket.on('connect', function() {
    console.log('Conectado al servidor');
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

function Profesor() {
    window.location = `./html/profesor/index.html?id=${1}`;
}

function Tutor() {
    window.location = `./html/tutor/index.html?id=${2}`;
}