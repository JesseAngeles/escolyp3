var socket = io();

var params = new URLSearchParams(window.location.search);

var Profesores = [];
var Grupos = [];
var cant_profesores;

// * Se desconecta del servidor
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

// * Actualiza la tabla cuando se crea un nuevo profesor
socket.on('lastCreateProfesor', function (profesor) {
    profesor.usu_gru = "Sin grupo";
    CreateRecord(profesor.usu_id, profesor.usu_app, profesor.usu_apm, profesor.usu_nom, Grupos);
    Profesores.push({
        usu_id: profesor.usu_id,
        tip_id: profesor.tip_id,
        usu_nom: profesor.usu_nom,
        usu_app: profesor.usu_app,
        usu_apm: profesor.usu_apm,
        usu_cor: profesor.usu_cor,
        usu_gru: "Sin grupo"
    });
    cant_profesores++;
    setCantProfesores(cant_profesores);
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


// * Actualiza la tabla cuando se actualiza un nuevo profesor
socket.on('lastUpdateProfesor', function (updated_profesor) {
    Profesores.forEach(profesor => {
        if (profesor.usu_id == updated_profesor.usu_id) {
            profesor = updated_profesor;
        }
    });

    var childElementsTable = document.getElementById(updated_profesor.usu_id).childNodes;

    childElementsTable[0].textContent = updated_profesor.usu_app;
    childElementsTable[1].textContent = updated_profesor.usu_apm;
    childElementsTable[2].textContent = updated_profesor.usu_nom;
})

// * Actualiza la tabla cuando se borra un profesor
socket.on('lastDeleteProfesor', function (deleted_profesor) {
    var record = document.getElementById(deleted_profesor);
    record.remove(record.parentNode);

    cant_profesores--;
    setCantProfesores(cant_profesores);
})

// * Se conecta al servidor
socket.emit('direccionGrupoAsignarProfesorConnection', function (profesores, grupos) {
    profesores.forEach(profesor => {
        CreateRecord(profesor.usu_id, profesor.usu_app, profesor.usu_apm, profesor.usu_nom, grupos);
    });

    Profesores = profesores;
    Grupos = grupos;
    cant_profesores = profesores.length;

    setCantProfesores(cant_profesores);
})

// * Actualiza la cantidad de profesores
function setCantProfesores(cant_profesores) {
    var texto = `Total: ${cant_profesores} profesores`;
    if (cant_profesores == 1) {
        texto = `Total: ${cant_profesores} profesor`;
    }
    document.getElementById('number_profesores').textContent = texto;
}

// * Crea un registro en la tabla
function CreateRecord(usu_id, usu_app, usu_apm, usu_nom, grupos) {
    const record = document.querySelector('#table_profesores');
    let tr = document.createElement('tr');
    tr.id = usu_id;

    let td_usu_app = document.createElement('td');
    td_usu_app.textContent = usu_app;

    let td_usu_apm = document.createElement('td');
    td_usu_apm.textContent = usu_apm;

    let td_usu_nom = document.createElement('td');
    td_usu_nom.textContent = usu_nom;

    let td_combo = document.createElement('td');

    let select = document.createElement('select');
    select.id = usu_id + "A";
    select.className = 'consultar'

    let noOption = document.createElement('option');
    noOption.textContent = "Sin grupo";
    noOption.value = null;
    noOption.id = 0;
    select.appendChild(noOption);

    grupos.forEach(grupo => {
        let option = document.createElement('option');
        option.textContent = grupo.gru_gra + grupo.gru_nom;
        option.value = grupo.gru_id + " " + usu_id;
        option.id = grupo.gru_id + " " + usu_id;
        select.appendChild(option);
        if (grupo.usu_id == usu_id) {
            select.value = option.value;
        }
    });

    td_combo.appendChild(select);

    tr.appendChild(td_usu_app);
    tr.appendChild(td_usu_apm);
    tr.appendChild(td_usu_nom);
    tr.appendChild(td_combo);

    record.appendChild(tr);
}

// * Asigna los profesores a sus grupos
function AssignProfesor() {
    Usuarios = [];
    Grupos = [];
    for (let i = 0; i < Profesores.length; i++) {
        var select = document.getElementById(Profesores[i].usu_id + "A");

        var option = select.options[select.selectedIndex].value.split(" ");
        Grupos.push(option[0]);
        Usuarios.push(select.id.slice(0, -1));
    }

    var CheckEquality = true;
    for (let i = 0; i < Grupos.length; i++) {
        if (Grupos[i] != "null") {
            for (let j = 0; j < Grupos.length; j++) {
                if (Grupos[i] == Grupos[j] && i != j) {
                    CheckEquality = false;
                    break;
                }
            }
        }
    }

    if (CheckEquality) {
        socket.emit('AssignProfesores', Usuarios, Grupos, function (res) {
            if (res) {
                alert('Se actualizaron correctamente los profesores');
            } else {
                alert('No se pudieron actualizar los profesores');
            }
        })
    } else {
        alert('No se puede asignar un mismo grupo a dos profesores');
    }
}