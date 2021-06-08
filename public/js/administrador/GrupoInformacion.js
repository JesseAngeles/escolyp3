var socket = io();

var params = new URLSearchParams(window.location.search);

var Profesor = {}
var Alumnos = {}
var cant_alumnos;
var usu_id;

var params = new URLSearchParams(window.location.search);

// * Se desconecta del servidor
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

// * Validacion del usaurio
if (params.has('usu_id')) {
    usu_id = window.location.href.split("usu_id=")[1];
    usu_id = usu_id.split("&gru_id=")[0];
    socket.emit('ValidateUsuario', usu_id, function (usuario) {
        if (!usuario) {
            window.location = "./../../login.html";
        }
    })
} else {
    window.location = "./../../login.html";
}

// * Actualiza la tabla cuando se actualiza un nuevo profesor
socket.on('lastUpdateProfesor', function (profesor) {
    var record = document.getElementById(Profesor.usu_id + "PRO");
    if (profesor.usu_id == usu_id) {
        console.log(profesor.gru_id);
        if (parseInt(profesor.gru_id) == params.get('gru_id')) {
            var childElementsTable = record.childNodes;

            childElementsTable[0].textContent = profesor.usu_app;
            childElementsTable[1].textContent = profesor.usu_apm;
            childElementsTable[2].textContent = profesor.usu_nom;
            childElementsTable[3].textContent = profesor.usu_cor;
            childElementsTable[4].firstChild.id = profesor.usu_id;
        } else {
            usu_id = null;
            record.remove(record.parentNode);
            alert('Se ah removido el profesor de este grupo');
        }
    } else {
        if (record) {
            record.remove(record.parentNode);
        }
        FillTableProfesores(profesor.usu_id, profesor.usu_app, profesor.usu_apm, profesor.usu_nom, profesor.usu_cor);
        Profesor = profesor;
        usu_id = profesor.usu_id;
    }
    Profesor = profesor;
})

// * Actualiza la tabla cuando se borra un profesor
socket.on('lastDeleteProfesor', function (res) {
    if (res == usu_id) {
        var record = document.getElementById(Profesor.usu_id + "PRO");
        record.remove(record.parentNode);
        Profesor = null;
        usu_id = null;
        alert('El profesor ah sido eliminado')
    }
})

// * Actualiza la tabla cuando se actualiza un nuevo alumno
socket.on('lastUpdateAlumno', function (alumno) {
    var record = document.getElementById(alumno.alu_id);
    if (record) {
        if (alumno.gru_id == params.get('gru_id')) {
            var childElementsTable = record.childNodes;
            childElementsTable[0].textContent = alumno.alu_app;
            childElementsTable[1].textContent = alumno.alu_apm;
            childElementsTable[2].textContent = alumno.alu_nom;
        } else {
            record.remove(record.parentNode);
            cant_alumnos--;
            setCantAlumnos(cant_alumnos);
        }
    } else {
        CreateRecordAlumno(alumno.alu_id, alumno.alu_app, alumno.alu_apm, alumno.alu_nom);
        cant_alumnos++;
        console.log(cant_alumnos);
        setCantAlumnos(cant_alumnos);
    }
})

// * Actualiza la tabla cuando se borra un alumno
socket.on('lastDeleteAlumno', function (alu_id) {
    record = document.getElementById(alu_id);
    if (record) {
        record.remove(record.parentNode);
        cant_alumnos--;
        setCantAlumnos(cant_alumnos);
    }
})

// * Se conecta al servidor
if (params.has('usu_id') && params.has('gru_id')) {
    socket.emit('direccionGrupoInformacionConnection', params.get('gru_id'), function (alumnos, profesor) {

        if (profesor) {
            FillTableProfesores(profesor.usu_id, profesor.usu_app, profesor.usu_apm, profesor.usu_nom, profesor.usu_cor);
            Profesor = profesor;
            usu_id = profesor.usu_id;
        } else {
            alert('No hay ningun profesor asignado a este grupo');
        }

        if (alumnos.length != 0) {
            alumnos.forEach(alumno => {
                CreateRecordAlumno(alumno.alu_id, alumno.alu_app, alumno.alu_apm, alumno.alu_nom);
            });
        } else {
            alert('No hay alumnos en este grupo');
        }

        Alumnos = alumnos;
        cant_alumnos = alumnos.length;
        setCantAlumnos(cant_alumnos);

    });
    if (params.get('gru_id') <= 6) {
        setTimeout(function () {
            boton = document.getElementById('button_delete');
            padre = boton.parentNode;
            padre.removeChild(boton);
        }, 200);
    }
} else {
    window.location = "./../../login.html";
}

// * Actualiza la informacion del profesor
function informationProfesor(e) {
    let ancestro = Ancestro(e.target, 0);
    var id = ancestro.id;

    window.location = `../../html/administrador/ProfesorEditar.html?usu_id=${params.get('usu_id')}&pro_id=${id}`;
}

// * Actualiza la informacion del alumno
function informationAlumno(e) {
    let ancestro = Ancestro(e.target, 0);
    var id = ancestro.id;
    window.location = `../../html/administrador/AlumnoEditar.html?usu_id=${params.get('usu_id')}&alu_id=${id}`;
}

// * Actualiza la cantidad de alumnos
function setCantAlumnos(cant_alumnos) {
    var texto = `Total: ${cant_alumnos} alumnos`;
    if (cant_alumnos == 1) {
        texto = `Total: ${cant_alumnos} alumno`;
    }
    document.getElementById('number_alumnos').textContent = texto;
}

// * Crea el registro del profesor
function FillTableProfesores(usu_id, usu_app, usu_apm, usu_nom, usu_cor) {
    const record = document.querySelector('#table_profesor');
    let tr = document.createElement('tr');
    tr.id = usu_id + "PRO";

    let td_apellidoP = document.createElement('td');
    td_apellidoP.textContent = usu_app;

    let td_apellidoM = document.createElement('td');
    td_apellidoM.textContent = usu_apm;

    let td_nombre = document.createElement('td');
    td_nombre.textContent = usu_nom;

    let td_correo = document.createElement('td');
    td_correo.textContent = usu_cor;

    let td_btn = document.createElement('td');

    let btn_information = document.createElement('button');
    btn_information.textContent = "Editar información ";
    btn_information.id = usu_id;
    btn_information.className = "consultar";

    btn_information.addEventListener('click', informationProfesor);

    let span_img = document.createElement('span');
    span_img.className = "las la-question-circle";

    btn_information.appendChild(span_img);

    td_btn.appendChild(btn_information);

    tr.appendChild(td_apellidoP);
    tr.appendChild(td_apellidoM);
    tr.appendChild(td_nombre);
    tr.appendChild(td_correo);
    tr.appendChild(td_btn);

    record.appendChild(tr);
}

// * Crea un registro en la tabla de alumnos
function CreateRecordAlumno(alu_id, alu_app, alu_apm, alu_nom) {

    const record = document.querySelector('#table_alumnos');
    let tr = document.createElement('tr');
    tr.id = alu_id;

    let td_apellidoP = document.createElement('td');
    td_apellidoP.textContent = alu_app;

    let td_apellidoM = document.createElement('td');
    td_apellidoM.textContent = alu_apm;

    let td_nombre = document.createElement('td');
    td_nombre.textContent = alu_nom;

    let td_btn = document.createElement('td');

    let btn_information = document.createElement('button');
    btn_information.textContent = "Consultar o editar información ";
    btn_information.id = alu_id;
    btn_information.className = "consultar";

    btn_information.addEventListener('click', informationAlumno);

    let span_img = document.createElement('span');
    span_img.className = "las la-question-circle";

    btn_information.appendChild(span_img);

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

// * Elimina el grupo
function DeleteGrupo() {
    var mensaje = confirm("se borrara el grupo, esta accion es irreversible");
    if (mensaje) {
        socket.emit('deleteGrupo', params.get('gru_id'), function (res) {
            if (res) {
                alert('Se borro el grupo');
                window.location = `./GrupoAdministrar.html?usu_id=${params.get('usu_id')}`;
            } else {
                alert('No se pudo borrar');
            }
        })
    } else {
        // Segunda confirmacion
        alert("No se elimino el grupo");
    }
}
