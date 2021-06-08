var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('id')) {
    alert("No se envio el ID")
    window.location = 'InicioSesion.html';
}

var id = params.get('id');
let usuario;

socket.on('disconnect', function() {
    window.location = '../index.html'
});

function Listado() {
    window.location = `pro_vistas/pro_listado.html?id=${id}`;
}

function Salidas() {
    window.location = `pro_vistas/pro_salidas.html?id=${id}`;
}

function CambiarContrasena() {
    window.location = `pro_vistas/pro_contrasena.html?id=${id}`;
}

function Salir() {
    window.location = 'index.html';
}