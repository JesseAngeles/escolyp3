var socket = io();

var params = new URLSearchParams(window.location.search);

// * Se desconecta del servidor
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

// * Validacion del usaurio
if (params.has('usu_id')) {
    usu_id = window.location.href.split("usu_id=")[1];
    socket.emit('ValidateUsuario', usu_id, function (usuario) {
        if (!usuario) {
            window.location = "./../../login.html";
        }
    })
} else {
    window.location = "./../../login.html";
}

// * Pasar de ciclo escolar
function PassCycle() {
    var mensaje = confirm("Todos los alumnos pasaran al grado siguiente," +
        "Esta accion es irreversible y todos los alumnos de sexto seran eliminados");
    if (mensaje) {
        socket.emit('PassCycle', function (res) {
            if (res) {
                alert('Los alumnos pasaron al grado siguiente');
            }
        })
    } else {
        // Segunda confirmacion
        alert("No se paso de grado");
    }
}

// * reinicia el estatus de los alumnos
function ResetStatusPass() {

    var mensaje = confirm("El estatus de todos los alumnos se actualizara a Ausente," +
        "esto afectara a todos los alumnos que se encuentren presentes y en proceso de salida");
    if (mensaje) {
        socket.emit('ResetStatus', function (res) {
            if (res) {
                alert('Se Reinicio el estatus de todos los alumnos');
            }
        })
    } else {
        // Segunda confirmacion
        alert("No se actualizo el estatus");
    }
}
