var socket = io();

var params = new URLSearchParams(window.location.search);

var Alumnos = [];
var cant_alumnos;

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

// * Actualiza la tabla cuando se crea un nuevo alumno
socket.on('lastCreateAlumno', function (alumno) {
    Alumnos.push({
        alu_id: alumno.alu_id,
        gru_id: alumno.gru_id,
        usu_id: alumno.usu_id,
        est_id: alumno.est_id,
        alu_nom: alumno.alu_nom,
        alu_app: alumno.alu_app,
        alu_apm: alumno.alu_apm,
    });

    if (alumno.gru_id == null) {
        CreateRecord(alumno.alu_id, alumno.alu_app, alumno.alu_apm, alumno.alu_nom);
        cant_alumnos++;
        setCantAlumnos(cant_alumnos);
    }
});

// * Actualiza la tabla cuando se actualiza un nuevo alumno
socket.on('lastUpdateAlumno', function (alumno) {
    if (!alumno.gru_id) {
        alumno.gru_id = 0;
    }

    Alumnos.forEach(Alumno => {
        if (Alumno.alu_id == alumno.alu_id) {
            Alumno.alu_nom = alumno.alu_nom;
            Alumno.alu_app = alumno.alu_app;
            Alumno.alu_apm = alumno.alu_apm;
            Alumno.gru_id = alumno.gru_id;
        }
    });

    if (alumno.gru_id == 0) {
        if (document.getElementById(alumno.alu_id + "A")) {
            var childElementsTable = document.getElementById(alumno.alu_id + "A").childNodes;

            childElementsTable[0].textContent = alumno.alu_app;
            childElementsTable[1].textContent = alumno.alu_apm;
            childElementsTable[2].textContent = alumno.alu_nom;
        } else {
            CreateRecord(alumno.alu_id, alumno.alu_app, alumno.alu_apm, alumno.alu_nom);
            cant_alumnos++;
            setCantAlumnos(cant_alumnos);
        }
    } else {
        var record = document.getElementById(alumno.alu_id + "A");
        record.remove(record.parentNode);
        cant_alumnos--;
        setCantAlumnos(cant_alumnos);
    }
})

// * Actualiza la tabla cuando se borra un alumno
socket.on('lastDeleteAlumno', function (res) {
    for (let i = 0; i < Alumnos.length; i++) {
        if (Alumnos[i].alu_id == res) {
            Alumnos.splice(i, 1);
        }
    }
    if (document.getElementById(res + "A")) {
        var record = document.getElementById(res + "A");
        record.remove(record.parentNode);
        cant_alumnos--;
        setCantAlumnos(cant_alumnos);
    }
})

// * Se conecta al servidor
socket.emit('direccionGrupoAsignarAlumnoConnection', function (alumnos, grupos) {
    alumnos.forEach(alumno => {
        CreateRecord(alumno.alu_id, alumno.alu_app, alumno.alu_apm, alumno.alu_nom);
    });

    grupos.forEach(grupo => {
        FillGrupos(grupo.gru_id, `${grupo.gru_gra}° ${grupo.gru_nom}`);
    });

    Alumnos = alumnos;
    if (Alumnos.length == 0) {
        alert('Todos los alumnos registrados ya estan asignados a sus grupos');
    }
    cant_alumnos = alumnos.length;
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

// * Llena la tabla de grupos
function FillGrupos(id, grupo) {
    const record = document.querySelector('#GrupoAlumnos');

    let option = document.createElement('option');
    option.textContent = grupo;
    option.value = id;
    option.id = "g" + id;
    record.appendChild(option);
}

// * Crea un registro en la tabla
function CreateRecord(alu_id, alu_app, alu_apm, alu_nom) {
    const record = document.querySelector('#table_alumnos');
    let tr = document.createElement('tr');
    tr.id = alu_id + "A";

    let td_apellidoP = document.createElement('td');
    td_apellidoP.textContent = alu_app;

    let td_apellidoM = document.createElement('td');
    td_apellidoM.textContent = alu_apm;

    let td_nombre = document.createElement('td');
    td_nombre.textContent = alu_nom;

    let td_check = document.createElement('td');

    let checkbox = document.createElement('input');
    checkbox.setAttribute("type", "checkbox");
    checkbox.id = alu_id;

    td_check.appendChild(checkbox);

    tr.appendChild(td_apellidoP);
    tr.appendChild(td_apellidoM);
    tr.appendChild(td_nombre);
    tr.appendChild(td_check);

    record.appendChild(tr);
}

// * Asigna los alumnos a el grupo
function AssignAlumno() {
    checked_alumnos = [];

    Alumnos.forEach(alumno => {
        if (document.getElementById(alumno.alu_id)) {
            if (document.getElementById(alumno.alu_id).checked) {
                checked_alumnos.push(alumno.alu_id);
            };
        }
    });

    grupo = document.getElementById('GrupoAlumnos').value;
    if (grupo) {
        var mensaje = confirm("Se asignaran los alumnos al grupo, esta accion es irreversible");
        if (mensaje) {
            socket.emit('AssignAlumnos', checked_alumnos, grupo, function (res) {
                if (res) {
                    checked_alumnos.forEach(alumno => {
                        var record = document.getElementById(alumno + "A");
                        record.remove();
                        for (let i = 0; i < Alumnos.length; i++) {
                            if (Alumnos[i].alu_id == alumno) {
                                Alumnos.splice(i, 1);
                            }
                        }
                        cant_alumnos--;
                    });
                }
                setCantAlumnos(cant_alumnos);
            });
        } else {
            // Segunda confirmacion
            alert("No se asignaron los alumnos");
        }
    } else {
        //No selecciono un grupo
        alert('Seleccione un grupo al cual desea asignar los alumnos');
    }


};