var socket = io();

var params = new URLSearchParams(window.location.search);

if (params.has('usu_id')) {
    socket.emit('ValidateUsuario', params.get('usu_id'), function (validated_usuario) {
        if (!validated_usuario) {
            window.location = "./../../login.html";
        }
    })
} else {
    window.location = "./../../login.html";
}

function index() {
    window.location = `./index.html?usu_id=${params.get('usu_id')}`;
}

function PasswordTutor() {
    window.location = `./PasswordTutor.html?usu_id=${params.get('usu_id')}`;
}

function SoporteTutor() {
    window.location = `./SoporteTutor.html?usu_id=${params.get('usu_id')}`;
}
