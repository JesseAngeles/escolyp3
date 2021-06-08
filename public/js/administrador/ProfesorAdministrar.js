var socket = io();

var params = new URLSearchParams(window.location.search);

var Profesores = {}
var cant_profesores;


// * Se desconecta del servidor
socket.on('disconnect', function () {
   console.log("Se desconecto del servidor");
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

// * Actualiza la tabla cuando se crea un nuevo profesor
socket.on('lastCreateProfesor', function (profesor) {
    profesor.usu_gru = "Sin grupo";
    CreateRecord(profesor.usu_id, profesor.usu_app, profesor.usu_apm, profesor.usu_nom, profesor.usu_gru, profesor.usu_cor);
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

// * Actualiza la tabla cuando se actualiza un nuevo profesor
socket.on('lastUpdateProfesor', function (updated_profesor) {
    Profesores.forEach(profesor => {
        if (document.getElementById(profesor.usu_gru).textContent == updated_profesor.usu_gru) {
            document.getElementById(profesor.usu_gru).textContent = "Sin grupo";
        }
        if (profesor.usu_id == updated_profesor.usu_id) {
            profesor = updated_profesor;
        }
    });

    var childElementsTable = document.getElementById(updated_profesor.usu_id).childNodes;

    childElementsTable[0].textContent = updated_profesor.usu_app;
    childElementsTable[1].textContent = updated_profesor.usu_apm;
    childElementsTable[2].textContent = updated_profesor.usu_nom;
    childElementsTable[3].textContent = updated_profesor.usu_gru;
    childElementsTable[4].textContent = updated_profesor.usu_cor;
})

// * Actualiza la tabla cuando se borra un profesor
socket.on('lastDeleteProfesor', function (deleted_profesor) {
    var record = document.getElementById(deleted_profesor);
    record.remove(record.parentNode);

    cant_profesores--;
    setCantProfesores(cant_profesores);
})

// * Se conecta al servidor
socket.emit('direccionProfesorConnection', 2, function (profesores) {
    if (profesores) {
        profesores.forEach(profesor => {
            CreateRecord(profesor.usu_id, profesor.usu_app, profesor.usu_apm, profesor.usu_nom, profesor.usu_gru, profesor.usu_cor);
        });

        Profesores = profesores;
        cant_profesores = profesores.length;
        setCantProfesores(cant_profesores);
    }
})

// * Crear un nuevo profesor
function ProfesorCrear() {
    window.location = `./ProfesorCrear.html?usu_id=${params.get('usu_id')}`;
}

// * Actualiza la cantidad de profesores
function setCantProfesores(cant_profesores) {
    var texto = `Total: ${cant_profesores} profesores`;
    if (cant_profesores == 1) {
        texto = `Total: ${cant_profesores} profesor`;
    }
    document.getElementById('number_profesores').textContent = texto;
}

// * Crea un registro en la tabla
function CreateRecord(usu_id, usu_app, usu_apm, usu_nom, usu_gru, usu_cor) {
    const record = document.querySelector('#table_profesores');
    let tr = document.createElement('tr');
    tr.id = usu_id;

    let td_usu_app = document.createElement('td');
    td_usu_app.textContent = usu_app;

    let td_usu_apm = document.createElement('td');
    td_usu_apm.textContent = usu_apm;

    let td_usu_nom = document.createElement('td');
    td_usu_nom.textContent = usu_nom;

    let td_usu_gru = document.createElement('td');
    td_usu_gru.id = usu_gru;
    td_usu_gru.textContent = usu_gru;

    let td_usu_cor = document.createElement('td');
    td_usu_cor.textContent = usu_cor;

    let td_btn = document.createElement('td');

    let btn_information = document.createElement('button');
    btn_information.textContent = "Editar información ";
    btn_information.id = `${usu_id}BTN`;
    btn_information.className = "consultar";

    btn_information.addEventListener('click', information);

    let span_img = document.createElement('span');
    span_img.className = "las la-question-circle";

    btn_information.appendChild(span_img);

    td_btn.appendChild(btn_information);

    tr.appendChild(td_usu_app);
    tr.appendChild(td_usu_apm);
    tr.appendChild(td_usu_nom);
    tr.appendChild(td_usu_gru);
    tr.appendChild(td_usu_cor);
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

// * Actualiza la informacion del profesor
function information(e) {
    let ancestro = Ancestro(e.target, 0);
    var id = ancestro.id;
    id = id.slice(0, -3);

    window.location = `../../html/administrador/ProfesorEditar.html?usu_id=${params.get('usu_id')}&pro_id=${id}`;
}