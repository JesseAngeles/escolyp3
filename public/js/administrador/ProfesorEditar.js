var socket = io();

var Profesor = {};

var params = new URLSearchParams(window.location.search);

// * Se desconecta del servidor
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

if (params.has('usu_id') && params.has('pro_id')) {
    // * Se conecta al servidor
    socket.emit('direccionProfesorEditarConnection', params.get('pro_id'), function (profesor, grupos) {
        if (profesor) {
            document.getElementById('NombreProfesor').value = profesor.usu_nom;
            document.getElementById('ApellidoPProfesor').value = profesor.usu_app;
            document.getElementById('ApellidoMProfesor').value = profesor.usu_apm;
            document.getElementById('EmailProfesor').value = profesor.usu_cor;
            Profesor = profesor;
            grupos.forEach(grupo => {
                var nombre = `${grupo.gru_gra}° ${grupo.gru_nom}`;
                FillGrupos(grupo.gru_id, nombre);
                if (grupo.usu_id == profesor.usu_id) {
                    profesor.gru_id = grupo.gru_id;
                    document.getElementById('GrupoProfesor').value = document.getElementById(grupo.gru_id).value;
                }
            });
        } else {
            window.location = `./ProfesorAdministrar.html?usu_id=${params.get('usu_id')}`;
        }
    })
} else {
    window.location = "./../../login.html";
}

// * Validacion del usaurio
if (params.has('usu_id')) {
    usu_id = window.location.href.split("usu_id=")[1];
    usu_id = usu_id.split("&pro_id=")[0];
    socket.emit('ValidateUsuario', usu_id, function (usuario) {
        if (!usuario) {
            window.location = "./../../login.html";
        }
    })
} else {
    window.location = "./../../login.html";
}

// * Inserta un grupo en el combobox
function FillGrupos(id, grupo) {
    const record = document.querySelector('#GrupoProfesor');

    let option = document.createElement('option');
    option.textContent = grupo;
    option.value = id;
    option.id = id;

    record.appendChild(option);
}

// * Actualiza la informacion del profesor
function UpdateProfesor() {
    profesor = {
        usu_id: Profesor.usu_id,
        tip_id: Profesor.tip_id,
        usu_nom: document.getElementById('NombreProfesor').value,
        usu_app: document.getElementById('ApellidoPProfesor').value,
        usu_apm: document.getElementById('ApellidoMProfesor').value,
        usu_cor: document.getElementById('EmailProfesor').value,
        gru_id: document.getElementById('GrupoProfesor').value
    }

    if (CheckEquality(profesor)) {

        profesor.usu_nom = ValidatioName(profesor.usu_nom);
        profesor.usu_app = ValidatioName(profesor.usu_app);
        profesor.usu_apm = ValidatioName(profesor.usu_apm);
        profesor.usu_cor = ValidationEmail(profesor.usu_cor);

        if (profesor.usu_nom && profesor.usu_app && profesor.usu_apm && profesor.usu_cor) {
            var changed_email = true;

            if (Profesor.usu_cor === profesor.usu_cor) {
                //Sin actualizacion del correo electronico
                changed_email = false;
            }

            socket.emit('updateProfesor', profesor, profesor.gru_id, changed_email, function (res) {
                if (res) {
                    Profesor = profesor;
                    alert("Se actualizo correctamente el profesor");
                } else {
                    //Sin actualizacion del correo electronico valida
                    alert("No se pudo actualizar el profesor");
                }
            })
        } else {
            //Sin datos ingresados
            alert('Favor de ingresar los datos correctamente');
        }
    } else {
        //Sin datos actualizados
        alert('No hubo cambios en los datos');
    }
}

// * Elimina la informacion del profesor
function DeleteProfesor() {
    var mensaje = confirm("Se borrara el profesor permanentemente");
    if (mensaje) {
        socket.emit('deleteProfesor', Profesor.usu_id, function (res) {
            if (res) {
                alert("Se borro el profesor");
                window.location = `./ProfesorAdministrar.html?usu_id=${params.get('usu_id')}`;
            } else {
                alert("No se pudo borrar el profesor");
            }
        })
    } else {
        // Segunda confirmacion
        alert("No se borro el profesor");
    }
}

// * Compara si hubo cambios en la informacion
function CheckEquality(profesor) {
    if (Profesor.usu_nom == profesor.usu_nom &&
        Profesor.usu_app == profesor.usu_app &&
        Profesor.usu_apm == profesor.usu_apm &&
        Profesor.usu_cor == profesor.usu_cor &&
        Profesor.gru_id == profesor.gru_id) {
        return false;
    } else {
        return true;
    }
}


function ValidatioName(text) {
    var regexp_name = /^([A-Z]{1}[a-zñáéíóú]+[\s]*)+$/;
    text = text.trim();
    if (text.split(' ').length <= 2) {
        text = toUpper(text);
        if (regexp_name.test(text)) {
            return text;
        }
    } else {
        return null;
    }
    return null;
}

function ValidationEmail(email) {
    email = email.toLowerCase();
    var regexp_email = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (regexp_email.test(email)) {
        return email;
    } else {
        return null;
    }
}

function toUpper(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(function (Word) {
            return Word[0].toUpperCase() + Word.substr(1);
        })
        .join(' ');
}