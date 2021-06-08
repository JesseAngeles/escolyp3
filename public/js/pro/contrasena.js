var params = new URLSearchParams(window.location.search);

if (!params.has('id')) {
    alert("No se envio el ID")
    window.location = '../../InicioSesion.html';
}

let id = params.get('id');

function Listado() {
    window.location = `pro_listado.html?id=${id}`;
}

function Salidas() {
    window.location = `pro_salidas.html?id=${id}`;
}

function Contrasena() {
    window.location = `pro_contrasena.html?id=${id}`;
}

function Salir() {
    window.location = '../../index.html';
}

socket.on('disconnect', function() {
    window.location = '../index.html'
});

function CambiarContrasena() {
    var socket = io();

    var contrasena_vieja = document.getElementById('pro_contrasenaV').value;
    var contrasena_nueva = document.getElementById('pro_contrasenaN').value;
    var contrasena_nueva_repeticion = document.getElementById('pro_comparacion').value;

    let bandera = false;

    let val_contrasena = /[a-zA-z0-9]{8,}/;
    if (val_contrasena.test(contrasena_nueva)) {
        if (val_contrasena.test(contrasena_nueva_repeticion)) {
            bandera = true;
        }
    }

    if (bandera) {

        socket.on('connect', function() {

            socket.emit('pro_Obtener', id, function(res) {
                var usuario = res;
                if (usuario[0].pro_contrasena === contrasena_vieja && contrasena_nueva === contrasena_nueva_repeticion) {
                    var profesor = {
                        id,
                        contrasena_nueva
                    }
                    socket.emit('pro_cambiarContrasena', profesor, function(res) {
                        Contrasena();
                    });
                }
            });
        });
    } else {
        alert('Las contraseñas no coinciden')
    }
}