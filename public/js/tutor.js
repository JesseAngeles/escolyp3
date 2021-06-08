var socket = io();

var params = new URLSearchParams(window.location.search);
let alu_id;

if (!params.has('id')) {
    alert("No se envio el ID")
    window.location = 'InicioSesion.html';
}

var id = params.get('id');
let usuario;

function CambiarContrasena() {
    window.location = `tut_vistas/tut_contrasena.html?id=${id}`;
}

function Salir() {
    window.location = 'index.html';
}

socket.on('connect', function() {
    socket.emit('tut_Obtener', id, function(tutor) {
        socket.emit('alu_Obtener', tutor[0].alu_id, function(alumno) {
            alu_id = tutor[0].alu_id;
            socket.emit('pro_Obtener', alumno[0].pro_id, function(profesor) {
                var nombre = `${alumno[0].alu_nombre} ${alumno[0].alu_apellidoP} ${alumno[0].alu_apellidoM}`;
                var grupo = `${profesor[0].pro_grupo}`;
                var profesor = `${profesor[0].pro_nombre} ${profesor[0].pro_apellidoP} ${profesor[0].pro_apellidoM}`;

                document.getElementById('nombre').innerHTML = nombre;
                document.getElementById('grupo').innerHTML = grupo;
                document.getElementById('profesor').innerHTML = profesor;
            })

        })
    })
});

socket.on('disconnect', function() {
    window.location = '../index.html'
});

function Salida() {
    var socket = io();
    socket.emit('alumnoEstado3', alu_id, function(res) {
        console.log(res);
    })
}

function Llegada() {
    var socket = io();
    socket.emit('alumnoEstado1', alu_id, function(res) {
        console.log(res);
    })
}

function Emergencia() {
    var socket = io();
    socket.emit('alumnoEstado5', alu_id, function(res) {
        console.log(res);
    })
}