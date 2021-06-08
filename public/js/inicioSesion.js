function obtenerDatos() {
    var correo = document.getElementById("correo").value;
    var contrasena = document.getElementById("contrasena").value;
    return { correo, contrasena };
}

function Administrador() {
    var socket = io();

    socket.on('connect', function() {
        console.log('Conectado al servidor');
        socket.emit('adm_validarUsuario', obtenerDatos(), function(id) {
            if (!id) {
                alert('Favor de ingresar correctamente los datos')
                window.location = 'InicioSesion.html';
            } else {
                window.location = `Administrador.html?id=${id}`;
            }
        });
    });

}

function Profesor() {
    var socket = io();

    socket.on('connect', function() {
        socket.emit('pro_validarUsuario', obtenerDatos(), function(id) {
            console.log(id);
            if (!id) {
                alert('Favor de ingresar correctamente los datos')
                window.location = 'InicioSesion.html';
            } else {
                window.location = `Profesor.html?id=${id}`;
            }
        });
    });

}

function Tutor() {
    var socket = io();

    socket.on('connect', function() {
        socket.emit('tut_validarUsuario', obtenerDatos(), function(id) {
            console.log(id);
            if (!id) {
                alert('Favor de ingresar correctamente los datos')
                window.location = 'InicioSesion.html';
            } else {
                window.location = `Tutor.html?id=${id}`;
            }
        });
    });

}