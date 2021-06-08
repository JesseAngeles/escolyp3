var socket = io();

var params = new URLSearchParams(window.location.search);

// escuchar
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


socket.on('LastCreateReport', function(report) {
    CreateRecord(report.cri_id, report.for_tit, report.for_des);
})

socket.emit('SoporteConnection', function(reports) {
    reports.forEach(report => {
        CreateRecord(report.cri_id, report.for_tit, report.for_des);
    });
})

function SoporteGraficas(){
    window.location = `./SoporteGraficas.html?usu_id=${params.get('usu_id')}`;
}

function CreateReport(){
    report = {
        usu_id: params.get('usu_id'),
        cri_id: document.getElementById('criticality').value,
        for_tit: document.getElementById('title').value,
        for_des: document.getElementById('description').value
    }

    report.for_tit = ValidateTitle(report.for_tit);

    if (report.usu_id && report.cri_id && report.for_tit && report.for_des) {
        socket.emit('CreateReport', report, function(res) {
        if (res) {
            alert('Se creo el reporte con exito');
        } else {
            alert('No se pudo registrar su peticion');
        }
    })
    } else {
        alert('Favor de llenar correctamente los campos');
    }
}

function CreateRecord(cri_id, for_tit, for_des){
    const record = document.querySelector('#main');
    let div_gral_grid = document.createElement('div');
    div_gral_grid.className = "contenido-gral-grid"

    let div_contenido = document.createElement('div');
    div_contenido.className = "contenido"

    let div_tarjeta = document.createElement('div');
    div_tarjeta.className = "tarjeta-contenido"

    let div_tarjeta_header = document.createElement('div');
    div_tarjeta_header.className = "tarjeta-contenido-header"

    let h3 = document.createElement('h3');
    h3.textContent = "Reporte"

    let span = document.createElement('span');
    span.className = "las la-bug"

    div_tarjeta_header.appendChild(h3);
    div_tarjeta_header.appendChild(span);

    let div_tarjeta_contenido = document.createElement('div');
    div_tarjeta_contenido.className = "tarjeta-contenido-body";

    let div_table = document.createElement('div');
    div_table.className = "table-responsive";

    let table = document.createElement('table');
    table.width = "100%";

    let tr_1 = document.createElement('tr');
    
    let td_11 = document.createElement('td');
    td_11.textContent = "Reporte";

    let td_12 = document.createElement('td');

    tr_1.appendChild(td_11);
    tr_1.appendChild(td_12);

    let tr_2 = document.createElement('tr');

    let td_21 = document.createElement('tr');
    td_21.textContent = "Titulo del reporte:";

    let td_22 = document.createElement('tr');
    td_22.textContent = for_tit;

    table.appendChild(tr_2);
    table.appendChild(td_21);
    table.appendChild(td_22);


    let tr_3 = document.createElement('tr');

    let td_31 = document.createElement('tr');
    td_31.textContent = "Descripción del reporte:";
    
    let td_32 = document.createElement('tr');
    td_32.textContent = for_des;

    table.appendChild(tr_3);
    table.appendChild(td_31);
    table.appendChild(td_32);

    div_table.appendChild(table);

    div_tarjeta_contenido.appendChild(div_table);

    div_tarjeta.appendChild(div_tarjeta_header);
    div_tarjeta.appendChild(div_tarjeta_contenido);

    div_contenido.appendChild(div_tarjeta);

    div_gral_grid.appendChild(div_contenido);

    record.appendChild(div_gral_grid);
}

function ValidateTitle(title) {
    title = title.trim();
    if (title.length < 20) {
        return title;
    } else {
        return null;
    }
}

function ValidateDescription(description) {
    description = description.trim();
    if (title.description < 225) {
        return title;
    } else {
        return null;
    }
}