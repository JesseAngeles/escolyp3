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

// * Crea a un nuevo alumno y tutor
function CreateAlumnoTutor() {
    let alumno = {
        alu_nom: document.getElementById('NombreAlumno').value,
        alu_app: document.getElementById('ApellidoPAlumno').value,
        alu_apm: document.getElementById('ApellidoMAlumno').value,
        est_id: 1
    }

    let tutor = {
        usu_nom: document.getElementById('NombreTutor').value,
        usu_app: document.getElementById('ApellidoPTutor').value,
        usu_apm: document.getElementById('ApellidoMTutor').value,
        usu_cor: document.getElementById('EmailTutor').value,
        tip_id: 3
    }

    alumno.alu_nom = ValidatioName(alumno.alu_nom);
    alumno.alu_app = ValidatioName(alumno.alu_app);
    alumno.alu_apm = ValidatioName(alumno.alu_apm);

    tutor.usu_nom = ValidatioName(tutor.usu_nom);
    tutor.usu_app = ValidatioName(tutor.usu_app);
    tutor.usu_apm = ValidatioName(tutor.usu_apm);
    tutor.usu_cor = ValidationEmail(tutor.usu_cor);

    if (alumno.alu_nom && alumno.alu_app && alumno.alu_apm &&
        tutor.usu_nom && tutor.usu_app && tutor.usu_apm && tutor.usu_cor) {

        socket.emit('createAlumnoTutor', alumno, tutor, function (res) {
            if (res) {
                alert("Se registro correctamente");
                document.getElementById('NombreAlumno').value = "";
                document.getElementById('ApellidoPAlumno').value = "";
                document.getElementById('ApellidoMAlumno').value = "";
                document.getElementById('NombreTutor').value = "";
                document.getElementById('ApellidoPTutor').value = "";
                document.getElementById('ApellidoMTutor').value = "";
                document.getElementById('EmailTutor').value = "";
            } else {
                //Datos duplicados
                alert("No se pudo registrar, ya hay otro usuario con el mismo correo electronico");
            }
        });
    } else {
        //Sin datos ingresados
        alert('Favor de ingresar todos los datos correctamente');
    }
};


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