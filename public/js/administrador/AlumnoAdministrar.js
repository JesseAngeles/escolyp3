var socket = io();

var params = new URLSearchParams(window.location.search);

var Alumnos = {}
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
        gru_id: 0
    });

    if (document.getElementById('GrupoAlumnos').value == 0) {
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

    if (document.getElementById('GrupoAlumnos').value == alumno.gru_id) {
        if (document.getElementById(alumno.alu_id)) {
            var childElementsTable = document.getElementById(alumno.alu_id).childNodes;

            childElementsTable[0].textContent = alumno.alu_app;
            childElementsTable[1].textContent = alumno.alu_apm;
            childElementsTable[2].textContent = alumno.alu_nom;
        } else {
            CreateRecord(alumno.alu_id, alumno.alu_app, alumno.alu_apm, alumno.alu_nom);
            cant_alumnos++;
            setCantAlumnos(cant_alumnos);
        }
    } else {
        var record = document.getElementById(alumno.alu_id);
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
    if (document.getElementById(res)) {
        var record = document.getElementById(res);
        record.remove(record.parentNode);
        cant_alumnos--;
        setCantAlumnos(cant_alumnos);
    }
})

// * Se conecta al servidor
socket.emit('direccionAlumnoConnection', function (alumnos, grupos) {
    grupos.forEach(grupo => {
        var grupo_nombre = `${grupo.gru_gra}° ${grupo.gru_nom}`
        FillGrupos(grupo.gru_id, grupo_nombre);
    });

    if (alumnos) {
        var number_alumnos = 0;
        alumnos.forEach(alumno => {
            if (!alumno.gru_id) {
                CreateRecord(alumno.alu_id, alumno.alu_app, alumno.alu_apm, alumno.alu_nom);
                alumno.gru_id = 0;
                number_alumnos++;
            }
        });
        Alumnos = alumnos;
        cant_alumnos = number_alumnos;
        setCantAlumnos(number_alumnos);
    }
})

// * Crea un nuevo Alumno
function AlumnoCrear() {
    window.location = `./AlumnoCrear.html?usu_id=${params.get('usu_id')}`;
}

// * Actualiza la cantidad de alumnos
function setCantAlumnos(cant_alumnos) {
    var texto = `Total: ${cant_alumnos} alumnos`;
    if (cant_alumnos == 1) {
        texto = `Total: ${cant_alumnos} alumno`;
    }
    document.getElementById('number_alumnos').textContent = texto;
}

// * Llena la tabla de grupos
function FillGrupos(gru_id, grupo) {
    const record = document.querySelector('#GrupoAlumnos');

    let option = document.createElement('option');
    option.textContent = grupo;
    option.value = gru_id;
    option.id = "g" + gru_id;
    record.appendChild(option);
}

// * Crea un registro en la tabla
function CreateRecord(alu_id, alu_app, alu_apm, alu_nom) {
    const record = document.querySelector('#table_alumnos');
    let tr = document.createElement('tr');
    tr.id = alu_id;

    let td_alu_app = document.createElement('td');
    td_alu_app.textContent = alu_app;

    let td_alu_apm = document.createElement('td');
    td_alu_apm.textContent = alu_apm;

    let td_alu_nom = document.createElement('td');
    td_alu_nom.textContent = alu_nom;

    let td_btn = document.createElement('td');

    let btn_information = document.createElement('button');
    btn_information.textContent = "Consultar o editar información ";
    btn_information.id = `${alu_id}BTN`;
    btn_information.className = "consultar";

    btn_information.addEventListener('click', information);

    let span_img = document.createElement('span');
    span_img.className = "las la-question-circle";

    btn_information.appendChild(span_img);

    td_btn.appendChild(btn_information);

    tr.appendChild(td_alu_app);
    tr.appendChild(td_alu_apm);
    tr.appendChild(td_alu_nom);
    tr.appendChild(td_btn);

    record.appendChild(tr);
}

// * Filtra por grupo a los alumnos
function FilterByGrupo() {
    var number_alumnos = 0;
    Alumnos.forEach(alumno => {
        if (document.getElementById(alumno.alu_id) && document.getElementById(alumno.alu_id).nodeName == "TR") {
            var record = document.getElementById(alumno.alu_id);
            record.remove(record.parentNode);
        }

        if (document.getElementById('GrupoAlumnos').value == alumno.gru_id) {
            CreateRecord(alumno.alu_id, alumno.alu_app, alumno.alu_apm, alumno.alu_nom);
            number_alumnos++;
        }

    });

    cant_alumnos = number_alumnos;
    setCantAlumnos(number_alumnos);
}

function Ancestro(ancestor, level) {
    if (level == 0) {
        return ancestor;
    } else {
        level--;
        return get_acenstors(ancestor.parentElement, level);
    }
}

// * Actualiza la informacion del alumno
function information(e) {
    let ancestro = Ancestro(e.target, 0);
    var id = ancestro.id;
    id = id.slice(0, -3);

    window.location = `../../html/administrador/AlumnoEditar.html?usu_id=${params.get('usu_id')}&alu_id=${id}`;
}