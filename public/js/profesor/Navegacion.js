var socket = io();

var params = new URLSearchParams(window.location.search);

if (params.has('usu_id')) {
    socket.emit('ValidateUsuario', params.get('usu_id'), function (validated_usuario) {
        console.log(validated_usuario);
        if (!validated_usuario) {
            //window.location = "./../../login.html";
        }
    })
} else {
    window.location = "./../../login.html";
}

function ListaAlumnos() {
    window.location = `./ListaAlumnos.html?usu_id=${params.get('usu_id')}`;
}

function index() {
    window.location = `./index.html?usu_id=${params.get('usu_id')}`;
}

function Salidas() {
    window.location = `./Salidas.html?usu_id=${params.get('usu_id')}`;
}

function PasswordProfesor() {
    window.location = `./PasswordProfesor.html?usu_id=${params.get('usu_id')}`;
}

function SoporteProfesor() {
    window.location = `./SoporteProfesor.html?usu_id=${params.get('usu_id')}`;
}
