var socket = io();

var Alumnos = []
var Grupo = []
var cant_alumnos;

var params = new URLSearchParams(window.location.search);

// * Se desconecta del servidor
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

// * Actualiza la tabla cuando se actualiza un nuevo alumno
socket.on('lastUpdateAlumno', function (alumno) {
    if (alumno.gru_id == Grupo.gru_id) {
        var find_alumno = false;
        Alumnos.forEach(Alumno => {
            if (Alumno.alu_id == alumno.alu_id) {
                Alumno.alu_nom = alumno.alu_nom;
                Alumno.alu_app = alumno.alu_app;
                Alumno.alu_apm = alumno.alu_apm;
                Alumno.gru_id = alumno.gru_id;
                find_alumno = true;
            }
        });

        if (document.getElementById(alumno.alu_id)) {
            var childElementsTable = document.getElementById(alumno.alu_id).childNodes;

            childElementsTable[0].textContent = alumno.alu_app;
            childElementsTable[1].textContent = alumno.alu_apm;
            childElementsTable[2].textContent = alumno.alu_nom;
        } else {
            Alumnos.push(alumno);
            CreateRecord(alumno.alu_id, alumno.alu_app, alumno.alu_apm, alumno.alu_nom, alumno.est_id);
            cant_alumnos++;
            setCantAlumnos(cant_alumnos);
        }

    }
})

// * Se actualiza el estautos del lumno
socket.on('LastUpdateStatus', function (alu_id, est_id) {
    var boton = document.getElementById(alu_id + "btn");
    if (boton && est_id) {
        Alumnos.forEach(alumno => {
            if (alumno.alu_id == alu_id) {
                alumno.est_id = est_id;
            }
        });
        switch (est_id) {
            case 1:
                boton.textContent = "Presente";
                boton.value = est_id;
                boton.disabled = false;
                break;
            case 2:
                boton.textContent = "Ausente";
                boton.value = est_id;
                boton.disabled = false;
                break;
            default:
                boton.textContent = "EN PROCESO DE SALIDA";
                boton.disabled = true;
                break;
        }
    }
})

socket.on('UnlockFunctions', function (flag) {
    alert('El estado de emergencia fue desactivado, se pueden permitir salidas');
})

// * Actualiza la tabla cuando se borra un alumno
socket.on('lastDeleteAlumno', function (res) {
    for (let i = 0; i < Alumnos.length; i++) {
        if (Alumnos[i].alu_id == res) {
            Alumnos.splice(i, 1);
        }
    }
    if (document.getElementById(res)) {
        var record = document.getElementById(res);
        record.remove(record.parentNode);
        cant_alumnos--;
        setCantAlumnos(cant_alumnos);
    }
})

// * Se conecta al servidor
socket.emit('ProfesorListaConecction', params.get('usu_id'), function (grupo, alumnos) {
    alumnos.forEach(alumno => {
        CreateRecord(alumno.alu_id, alumno.alu_app, alumno.alu_apm, alumno.alu_nom, alumno.est_id);
    });
    Grupo = grupo;
    Alumnos = alumnos;
    cant_alumnos = Alumnos.length;
    setCantAlumnos(cant_alumnos);

})

// * Actualiza la cantidad de alumnos
function setCantAlumnos(cant_alumnos) {
    var texto = `Total: ${cant_alumnos} alumnos`;
    if (cant_alumnos == 1) {
        texto = `Total: ${cant_alumnos} alumno`;
    }
    document.getElementById('number_alumnos').textContent = texto;
}

// * Crea un registro en la tabla
function CreateRecord(id, apellidoP, apellidoM, nombre, status) {
    const record = document.querySelector('#table_alumnos');
    let tr = document.createElement('tr');
    tr.id = id;

    let td_apellidoP = document.createElement('td');
    td_apellidoP.textContent = apellidoP;

    let td_apellidoM = document.createElement('td');
    td_apellidoM.textContent = apellidoM;

    let td_nombre = document.createElement('td');
    td_nombre.textContent = nombre;

    let td_btn = document.createElement('td');

    let btn_information = document.createElement('button');

    switch (status) {
        case 1:
            btn_information.textContent = "Presente";
            btn_information.disabled = false;
            break;
        case 2:
            btn_information.textContent = "Ausente";
            btn_information.disabled = false;
            break;
        default:
            btn_information.textContent = "EN PROCESO DE SALIDA";
            btn_information.disabled = true;
            break;
    }

    btn_information.id = id + "btn";
    btn_information.value = status;
    btn_information.className = "consultar";

    btn_information.addEventListener('click', Presente);

    td_btn.appendChild(btn_information);

    tr.appendChild(td_apellidoP);
    tr.appendChild(td_apellidoM);
    tr.appendChild(td_nombre);
    tr.appendChild(td_btn);

    record.appendChild(tr);
}

function Ancestro(ancestor, level) {
    if (level == 0) {
        return ancestor;
    } else {
        level--;
        return get_acenstors(ancestor.parentElement, level);
    }
}

// * Marca al alumno como presente en la clase
function Presente(e) {
    let ancestro = Ancestro(e.target, 0);
    var id = ancestro.id;
    id = id.slice(0, -3);
    var est = ancestro.value;

    socket.emit('ListChangeAlumno', id, est, function (new_est) {
        switch (new_est) {
            case 1:
                ancestro.textContent = "Presente";
                break;
            case 2:
                ancestro.textContent = "Ausente";
                break;
            default:
                ancestro.textContent = "EN PROCESO DE SALIDA";
                break;
        }

        ancestro.value = new_est;
    })
}