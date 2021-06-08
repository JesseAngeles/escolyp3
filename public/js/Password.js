var socket = io();

var params = new URLSearchParams(window.location.search);

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

function ChangePassword() {
    password = document.getElementById('Password').value;
    new_password = document.getElementById('NewPassword').value;
    confirm_new_password = document.getElementById('ConfirmNewPassword').value;

    new_password = ValidatePassword(new_password);
    confirm_new_password = ValidatePassword(confirm_new_password);

    if (password && new_password && confirm_new_password) {
        if (new_password === confirm_new_password) {
            socket.emit('ChangePassword', params.get('usu_id'), password, new_password, function (res) {
                if (res) {
                    alert('Contraseña cambiada con exito');
                    document.getElementById('Password').value = "";
                    document.getElementById('NewPassword').value = "";
                    document.getElementById('ConfirmNewPassword').value = "";
                } else {
                    //La contrseña actual no coincide
                    alert('La contraseña actual ingresada es incorrecta');
                }
            })
        } else {
            //Sin coincidencias
            alert('Las contraseñas no coinciden');
        }
    } else {
        //Campos vacios
        alert('Favor de llenar todos los campos, contraseña muy facil');
    }
}

function ValidatePassword(password){
    var regex_password = /^[a-zA-Z0-9!@#$%^:&*]{8,}$/;
    if (regex_password.test(password)) {
        return password;
    } else {
        return null;
    }
}