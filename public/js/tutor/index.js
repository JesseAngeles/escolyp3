var socket = io();

var Alumno = {}
var Grupo = {}
var alu_est_id;

var params = new URLSearchParams(window.location.search);

// * Se desconecta del servidor
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

// * Se actualiza el estautos del lumno
socket.on('LastUpdateStatus', function (alu_id, est_id) {
    if (alu_id == Alumno.alu_id && est_id) {
        SetStatus(est_id);
        alu_est_id = est_id;
    }
})

function SetStatus(est_id) {
    var est_alunmo;
    switch (est_id) {
        case 1:
            est_alunmo = "En casa"
            break;
        case 2:
            est_alunmo = "En escuela"
            break;
        case 3:
            est_alunmo = "Con solicitud"
            break;
        case 4:
            est_alunmo = "En camino"
            break;
        case 5:
            est_alunmo = "Emergencia"
            break;

        default:
            est_alunmo = "guatafak bro"
            break;
    }
    document.getElementById('est_alumno').textContent = `Estatus: ${est_alunmo}`
}

socket.emit('TutorSolicitudConecction', params.get('usu_id'), function (grupo, alumno, profesor) {
    SetStatus(alumno.est_id);
    var profesor_name = `${profesor.usu_app} ${profesor.usu_apm} ${profesor.usu_nom}`;
    CreateRecord(alumno.alu_id, alumno.alu_app, alumno.alu_apm, alumno.alu_nom, alumno.gru_id, profesor_name);

    Alumno = alumno;
    Grupo = grupo;
    alu_est_id = alumno.est_id;
})

function CreateRecord(id, apellidoP, apellidoM, nombre, grupo, profesor) {
    const record = document.querySelector('#table_alumnos');
    let tr = document.createElement('tr');
    tr.id = id;

    let td_apellidoP = document.createElement('td');
    td_apellidoP.textContent = apellidoP;

    let td_apellidoM = document.createElement('td');
    td_apellidoM.textContent = apellidoM;

    let td_nombre = document.createElement('td');
    td_nombre.textContent = nombre;

    let td_grupo = document.createElement('td');
    td_grupo.textContent = grupo;

    let td_profesor = document.createElement('td');
    td_profesor.textContent = profesor;

    tr.appendChild(td_apellidoP);
    tr.appendChild(td_apellidoM);
    tr.appendChild(td_nombre);
    tr.appendChild(td_grupo);
    tr.appendChild(td_profesor);

    record.appendChild(tr);
}

function ExitPetition() {
    var mensaje = confirm("Se notificara al profesor para que pueda dar salida al alumno");
    if (mensaje) {
        socket.emit('ExitPetitionAlumno', Alumno.alu_id, alu_est_id, function (new_est) {
            if (new_est) {
                alu_est_id = new_est;
                SetStatus(alu_est_id);
            } else {
                alert('No se puede solicitar la salida del alumno');
            }
        })
    } else {
        // Segunda confirmacion
        alert("No se solicito salida");
    }
}

function Confirm() {
    var mensaje = confirm("¿El alumno llego con usted?");
    if (mensaje) {
        socket.emit('ConfirmExitAlumno', Alumno.alu_id, alu_est_id, function (new_est) {
            if (new_est) {
                alu_est_id = new_est;
                SetStatus(alu_est_id);
            } else {
                alert('No se puede Confirmar la llegada del alumno, ya que no se ha concedido');
            }
        })
    }
}

function Emergency() {
    var mensaje = confirm("¿Desea activar el estado de emergencia?, " +
        "Esto detiene los permisos de salida por lo que se debe de hacer un uso correcto");
    if (mensaje) {
        socket.emit('EmergencyAlumno', Alumno.alu_id, alu_est_id, function (new_est) {
            if (new_est) {
                alu_est_id = new_est;
                SetStatus(alu_est_id);
            } else {
                alert('No se puede activar el estado de emergencia ya que no se ha concedido su salida');
            }
        })
    }
}