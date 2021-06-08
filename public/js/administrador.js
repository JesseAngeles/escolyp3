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

function Profesores() {
    window.location = `adm_vistas/adm_profesores.html?id=${id}`;
}

function Alumnos() {
    window.location = `adm_vistas/adm_alumnos.html?id=${id}`;
}

function CambiarContrasena() {
    window.location = `adm_vistas/adm_contrasena.html?id=${id}`;
}

function Salir() {
    window.location = 'index.html';
}