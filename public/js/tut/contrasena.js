var params = new URLSearchParams(window.location.search);

if (!params.has('id')) {
    alert("No se envio el ID")
    window.location = '../../InicioSesion.html';
}

let id = params.get('id');

function Regresar() {
    window.location = `../tutor.html?id=${id}`;
}

socket.on('disconnect', function() {
    window.location = '../index.html'
});

function Contrasena() {
    window.location = `tut_contrasena.html?id=${id}`;
}

function Salir() {
    window.location = '../../index.html';
}

function CambiarContrasena() {
    var socket = io();

    var contrasena_vieja = document.getElementById('tut_contrasenaV').value;
    var contrasena_nueva = document.getElementById('tut_contrasenaN').value;
    var contrasena_nueva_repeticion = document.getElementById('tut_comparacion').value;

    let bandera = false;

    let val_contrasena = /[a-zA-z0-9]{8,}/;
    if (val_contrasena.test(contrasena_nueva)) {
        if (val_contrasena.test(contrasena_nueva_repeticion)) {
            bandera = true;
        }
    }

    if (bandera) {

        socket.on('connect', function() {

            socket.emit('tut_Obtener', id, function(res) {
                var usuario = res;
                if (usuario[0].tut_contrasena === contrasena_vieja && contrasena_nueva === contrasena_nueva_repeticion) {
                    var tutor = {
                        id,
                        contrasena_nueva
                    }
                    socket.emit('tut_cambiarContrasena', tutor, function(res) {
                        Contrasena();
                    });
                }
            });
        });
    } else {
        alert('Las contraseñas no coinciden')
    }
}