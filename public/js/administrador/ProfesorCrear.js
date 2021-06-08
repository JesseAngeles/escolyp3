var socket = io();

var params = new URLSearchParams(window.location.search);

// * Se desconecta del servidor
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

// * Crea un nuevo profesor
function CreateProfesor() {
    let profesor = {
        usu_nom: document.getElementById('NombreProfesor').value,
        usu_app: document.getElementById('ApellidoPProfesor').value,
        usu_apm: document.getElementById('ApellidoMProfesor').value,
        usu_cor: document.getElementById('EmailProfesor').value,
        tip_id: 2
    }

    profesor.usu_nom = ValidatioName(profesor.usu_nom);
    profesor.usu_app = ValidatioName(profesor.usu_app);
    profesor.usu_apm = ValidatioName(profesor.usu_apm);
    profesor.usu_cor = ValidationEmail(profesor.usu_cor);

    console.log(profesor);
    if (profesor.usu_nom && profesor.usu_app && profesor.usu_apm && profesor.usu_cor) {
        
        socket.emit('createProfesor', profesor, function (res) {
            if (res) {
                alert("Se registro correctamente");
                document.getElementById('NombreProfesor').value = "";
                document.getElementById('ApellidoPProfesor').value = "";
                document.getElementById('ApellidoMProfesor').value = "";
                document.getElementById('EmailProfesor').value = "";
            } else {
                //Datos duplicados
                alert("No se pudo registrar, ya hay otro usuario con el mismo correo electronico");
            }
        });
    } else {
        //Sin datos ingresados
        alert('Favor de ingresar los datos correctamente');
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