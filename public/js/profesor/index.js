var socket = io();

var params = new URLSearchParams(window.location.search);

socket.on('connect', function() {
    console.log('Conectado');
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

socket.on('UnlockFunctions', function (flag) {
    alert('El estado de emergencia fue desactivado, se pueden permitir salidas');
})

function ListaAlumnos() {
    window.location = `../../html/profesor/ListaAlumnos.html?id=${params.get('id')}`;
}
function Salidas() {
    window. location = `./Salidas.html?id=${params.get('id')}`;
}