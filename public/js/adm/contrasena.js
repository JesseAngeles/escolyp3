var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('id')) {
    alert("No se envio el ID")
    window.location = '../../InicioSesion.html';
}

let id = params.get('id');

function Profesores() {
    window.location = `adm_profesores.html?id=${id}`;
}

function Alumnos() {
    window.location = `adm_alumnos.html?id=${id}`;
}

function Contrasena() {
    window.location = `adm_contrasena.html?id=${id}`;
}

function Salir() {
    window.location = '../../index.html';
}

socket.on('disconnect', function() {
    window.location = '../index.html'
});

function CambiarContrasena() {
    var socket = io();

    var contrasena_vieja = document.getElementById('adm_contrasenaV').value;
    var contrasena_nueva = document.getElementById('adm_contrasenaN').value;
    var contrasena_nueva_repeticion = document.getElementById('adm_comparacion').value;

    let bandera = false;

    let val_contrasena = /[a-zA-z0-9]{8,}/;
    if (val_contrasena.test(contrasena_nueva)) {
        if (val_contrasena.test(contrasena_nueva_repeticion)) {
            bandera = true;
        }
    }

    if (bandera) {
        socket.on('connect', function() {
            socket.emit('adm_Obtener', id, function(res) {
                var usuario = res;
                if (usuario[0].adm_contrasena === contrasena_vieja && contrasena_nueva === contrasena_nueva_repeticion) {
                    var administrador = {
                        id,
                        contrasena_nueva
                    }
                    socket.emit('adm_cambiarContrasena', administrador);
                }
            });
        });
    } else {
        alert('Las contraseñas no coinciden')
    }
}