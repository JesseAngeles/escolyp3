var socket = io();

socket.on('connect', function () {
    console.log('Conectado al servidor');
});

// escuchar
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

function Administracion(usu_id) {
    window.location = `./html/administrador/index.html?usu_id=${usu_id}`;
}

function Profesor(usu_id) {
    window.location = `./html/profesor/index.html?usu_id=${usu_id}`;
}

function Tutor(usu_id) {
    window.location = `./html/tutor/index.html?usu_id=${usu_id}`;
}

function Login() {
    var usuario = {
        usu_cor: document.getElementById('EmailUsuario').value,
        usu_con: document.getElementById('PasswordUsuario').value
    }

    if (usuario.usu_cor && usuario.usu_con) {
        socket.emit('LoginUsuario', usuario, function (usuario) {
            if (usuario) {
                switch (usuario.tip_id) {
                    case 1:
                        Administracion(usuario.usu_id);
                        break;
                    case 2:
                        Profesor(usuario.usu_id);
                        break;
                    case 3:
                        Tutor(usuario.usu_id);
                        break;
                    default:
                        alert('Hay un error con tu cuenta, favor de comunicarte con la escuela');
                        break;
                }
            } else {
                alert('Los datos son erroneos');
            }
        })
    } else {
        alert('Favor de llenar todos los campos');
    }
}

function Token() {
    var record = document.querySelector('#login');

    var input_token = document.createElement('input');
    input_token.id = "TokenUsuario";
    input_token.required = true;
    input_token.autofocus = true;
    input_token.placeholder = "Ingresa tu token";
    input_token.type = "text";

    var btn_token = document.createElement('button');
    btn_token.addEventListener("click", LoginByToken);
    btn_token.textContent = "Iniciar Sesión por Token";

    record.appendChild(input_token);
    record.appendChild(btn_token);
    
    token_button = document.getElementById('btn_token');
    token_button.disabled = true;

}

function LoginByToken(){
    token = document.getElementById('TokenUsuario').value;
    
    if (token) {
        socket.emit('LoginByTokenUsuario', token, function (usuario) {
            if (usuario) {
                switch (usuario.tip_id) {
                    case 1:
                        Administracion(usuario.usu_id);
                        break;
                    case 2:
                        Profesor(usuario.usu_id);
                        break;
                    case 3:
                        Tutor(usuario.usu_id);
                        break;
                    default:
                        alert('Hay un error con tu cuenta, favor de comunicarte con la escuela');
                        break;
                }
            } else {
                alert('Los datos son erroneos');
            }
        })
    } else {
        alert('Favor de llenar todos los campos');
    }

}