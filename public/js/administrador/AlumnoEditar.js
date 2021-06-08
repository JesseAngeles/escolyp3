var socket = io();

var Alumno = {}
var Tutor = {}

var params = new URLSearchParams(window.location.search);

// * Se desconecta del servidor
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

if (params.has('usu_id') && params.has('alu_id')) {
    // * Se conecta al servidor
    socket.emit('direccionAlumnoEditarConnection', params.get('alu_id'), function (alumno, tutor, grupos) {
        if (alumno && tutor && grupos) {
            document.getElementById('NombreAlumno').value = alumno.alu_nom;
            document.getElementById('ApellidoPAlumno').value = alumno.alu_app;
            document.getElementById('ApellidoMAlumno').value = alumno.alu_apm;

            document.getElementById('NombreTutor').value = tutor.usu_nom;
            document.getElementById('ApellidoPTutor').value = tutor.usu_app;
            document.getElementById('ApellidoMTutor').value = tutor.usu_apm;
            document.getElementById('EmailTutor').value = tutor.usu_cor;
            Alumno = alumno;
            Tutor = tutor;

            grupos.forEach(grupo => {
                FillGrupos(grupo.gru_id, grupo.gru_gra + grupo.gru_nom);
                if (grupo.gru_id == alumno.gru_id) {
                    Alumno.gru_id = grupo.gru_id;
                    document.getElementById('GrupoAlumno').value = document.getElementById(grupo.gru_id).value;
                }
            });

        } else {
            window.location = './AlumnoAdministrar.html';
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

// * Inserta un grupo en el ComboBox
function FillGrupos(gru_id, grupo) {
    const record = document.querySelector('#GrupoAlumno');

    let option = document.createElement('option');
    option.textContent = grupo;
    option.value = gru_id;
    option.id = gru_id;

    record.appendChild(option);
}

// * Actualiza la informacion del alumo y el tutor
function UpdateAlumno() {
    alumno = {
        alu_id: Alumno.alu_id,
        alu_nom: document.getElementById('NombreAlumno').value,
        alu_app: document.getElementById('ApellidoPAlumno').value,
        alu_apm: document.getElementById('ApellidoMAlumno').value,
        gru_id: document.getElementById('GrupoAlumno').value
    }

    if (alumno.gru_id == 0) {
        alumno.gru_id = null;
    }

    tutor = {
        usu_id: Tutor.usu_id,
        usu_nom: document.getElementById('NombreTutor').value,
        usu_app: document.getElementById('ApellidoPTutor').value,
        usu_apm: document.getElementById('ApellidoMTutor').value,
        usu_cor: document.getElementById('EmailTutor').value
    }


    if (CheckEquality(alumno, tutor)) {

        alumno.alu_nom = ValidatioName(alumno.alu_nom);
        alumno.alu_app = ValidatioName(alumno.alu_app);
        alumno.alu_apm = ValidatioName(alumno.alu_apm);

        tutor.usu_nom = ValidatioName(tutor.usu_nom);
        tutor.usu_app = ValidatioName(tutor.usu_app);
        tutor.usu_apm = ValidatioName(tutor.usu_apm);
        tutor.usu_cor = ValidationEmail(tutor.usu_cor);

        if (alumno.alu_nom && alumno.alu_app && alumno.alu_apm &&
            tutor.usu_nom && tutor.usu_app && tutor.usu_apm && tutor.usu_cor) {
            var changed_email = true;

            if (Tutor.usu_cor === tutor.usu_cor) {
                //Sin actualizacion del correo electronico
                changed_email = false;
            }

            socket.emit('updateAlumno', alumno, tutor, changed_email, function (res) {
                if (res) {
                    Tutor = tutor;
                    Alumno = alumno;
                    alert("Se actualizo correctamente el alumno y el tutor");
                } else {
                    //Sin actualizacion del correo electronico valida
                    alert("No se pudo actualizar el tutor porque el correo electronico ya esta en uso");
                }
            })
        } else {
            //Sin datos ingresados
            alert('Favor de ingresar todos los datos correctamente');
        }
    } else {
        //Sin datos actualizados
        alert('No hubo cambios en los datos');
    }
}

// * Elimina la informacion del alumno y el tutor
function DeleteAlumno() {

    var mensaje = confirm("Se borrara el alumno y el tutor permanentemente");
    if (mensaje) {
        socket.emit('deleteAlumno', Alumno.alu_id, Tutor.usu_id, function (res) {
            if (res) {
                alert("Se borro el Alumno");
                window.location = `./AlumnoAdministrar.html?usu_id=${params.get('usu_id')}`;
            } else {
                alert("No se pudo borro el Alumno");
            }
        })
    } else {
        // Segunda confirmacion
        alert("No se borro el alumno");
    }
}

// * Compara si hubo cambios en la informacion
function CheckEquality(alumno, tutor) {
    if (Tutor.usu_nom == tutor.usu_nom &&
        Tutor.usu_app == tutor.usu_app &&
        Tutor.usu_apm == tutor.usu_apm &&
        Tutor.usu_cor == tutor.usu_cor &&
        Alumno.alu_nom == alumno.alu_nom &&
        Alumno.alu_app == alumno.alu_app &&
        Alumno.alu_apm == alumno.alu_apm &&
        Alumno.gru_id == alumno.gru_id) {
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