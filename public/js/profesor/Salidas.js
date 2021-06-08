var socket = io();

var Alumnos = {}

var params = new URLSearchParams(window.location.search);

socket.on('connect', function () {
    console.log('Conectado');
});

// escuchar
socket.on('disconnect', function () {
    console.log('Perdimos conexión con el servidor');
});

socket.on('LastUpdateStatus', function (alu_id, est_id) {
    if (document.getElementById(alu_id)) {
        if (est_id <= 3) {
            var record = document.getElementById(alu_id);
            record.remove(record.parentNode);
            texto = document.getElementById('cant_alumnos').textContent;
            partes = texto.split(': ');
            numero = parseInt(partes[1], 10);
            document.getElementById('cant_alumnos').textContent = `Total alumnos: ${numero - 1}`;
        } else {
            SetStatus(alu_id, est_id);
        }
    } else {
        socket.emit('direccionAlumnoEditarConnection', alu_id, function (alumno) {
            CreateRecord(alumno.alu_id, alumno.alu_app, alumno.alu_apm, alumno.alu_nom, alumno.est_id);
            texto = document.getElementById('cant_alumnos').textContent;
            partes = texto.split(': ');
            numero = parseInt(partes[1], 10);
            document.getElementById('cant_alumnos').textContent = `Total alumnos: ${numero + 1}`;
        })
    }
})

socket.on('Emergency', function (alu_id) {
    alert('Estado de emergencia activado, los permisos de salida seran suspendidos');
    window.location = `./index.html?usu_id=${params.get('usu_id')}`;
})

function SetStatus(alu_id, est_id) {
    var est_alumno;
    switch (est_id) {
        case 1:
            est_alumno = "En casa"
            break;
        case 2:
            est_alumno = "En escuela"
            break;
        case 3:
            est_alumno = "Con solicitud"
            break;
        case 4:
            est_alumno = "En camino"
            break;
        case 5:
            est_alumno = "Emergencia"
            break;

        default:
            est_alumno = "guatafak bro"
            break;
    }
    var childElementsTable = document.getElementById(alu_id).childNodes;

    childElementsTable[3].textContent = est_alumno;
    childElementsTable[4].firstChild.textContent = est_alumno;
}

socket.emit('ProfesorListaConecction', params.get('usu_id'), function (grupo, alumnos) {
    var cont = 0;
    for (let i = 0; i < alumnos.length; i++) {
        if (alumnos[i].est_id >= 3) {
            CreateRecord(alumnos[i].alu_id, alumnos[i].alu_app, alumnos[i].alu_apm, alumnos[i].alu_nom, alumnos[i].est_id);
            cont++;
        }
    }
    document.getElementById('cant_alumnos').textContent = `Total Alumnos: ${cont}`
});

socket.emit('ProfesorCheckFunctions', function (flag) {
    if (flag) {
        alert('Estado de emergencia activado, los permisos de salida seran suspendidos');
        window.location = `./index.html?usu_id=${params.get('usu_id')}`;
    }
})

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

    let td_status = document.createElement('td');
    td_status.id = `${id}${status}`

    let td_btn = document.createElement('td');

    let btn_information = document.createElement('button');

    switch (status) {
        case 3:
            btn_information.textContent = "Permitir salida";
            td_status.textContent = "Con solicitud de salida";
            break;
        case 4:
            btn_information.textContent = "En camino";
            btn_information.disabled = true;
            td_status.textContent = "En camino";
            break;
        case 5:
            btn_information.textContent = "Emergencia";
            btn_information.disabled = true;
            td_status.textContent = "Emergencia";
            break;
        default:
            btn_information.textContent = "Proceso concluido";
            btn_information.disabled = true;
            break;
    }

    btn_information.id = id + "BTN";
    btn_information.value = status;
    btn_information.className = "consultar";

    btn_information.addEventListener('click', Salida);

    td_btn.appendChild(btn_information);

    tr.appendChild(td_apellidoP);
    tr.appendChild(td_apellidoM);
    tr.appendChild(td_nombre);
    tr.appendChild(td_status);
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

function Salida(e) {
    let ancestro = Ancestro(e.target, 0);
    var id = ancestro.id;
    var est = ancestro.value;
    id = id.slice(0, -3);

    socket.emit('ExitAlumno', id, est, function (new_est) {
        ancestro.textContent = "En camino";
        ancestro.disabled = true;
        ancestro.value = new_est;
        document.getElementById(`${id}${est}`).textContent = "En camino";
        document.getElementById(`${id}${est}`).id = `${id}${new_est}`;
    })
}