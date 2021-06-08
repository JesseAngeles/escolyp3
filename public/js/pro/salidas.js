var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('id')) {
    alert("No se envio el ID")
    window.location = '../../InicioSesion.html';
}

setTimeout('document.location.reload()', 10000);

let id = params.get('id');

function Listado() {
    window.location = `pro_listado.html?id=${id}`;
}

function Salidas() {
    window.location = `pro_salidas.html?id=${id}`;
}

function Contrasena() {
    window.location = `pro_contrasena.html?id=${id}`;
}

function Salir() {
    window.location = '../../index.html';
}

socket.on('connect', function() {
    socket.emit('pro_obtenerAlumnos', id, function(res) {
        borrarTabla();
        for (let i = 0; i < res.length; i++) {
            crearRegistro(res[i].alu_id, res[i].alu_nombre, res[i].alu_apellidoP, res[i].alu_apellidoM);
            socket.emit('alumnoEstado', res[i].alu_id, function(estado) {
                Status(estado, res[i].alu_id);
            })
        }
    })
});

socket.on('disconnect', function() {
    window.location = '../index.html'
});

socket.on('datos', function(res) {
    console.log(res);
})

function crearRegistro(alu_id, alu_nombre, alu_apellidoP, alu_apellidoM) {
    const registro = document.querySelector('#tabla_alumnos');
    let tr = document.createElement('tr');
    tr.id = 'registro';

    let nombre = document.createElement('td');
    nombre.textContent = alu_nombre;

    let apellidoP = document.createElement('td');
    apellidoP.textContent = alu_apellidoP;

    let apellidoM = document.createElement('td');
    apellidoM.textContent = alu_apellidoM;

    let status = document.createElement('td');
    status.textContent = 'NaN';
    status.id = alu_id;

    let grupo = document.createElement('td');

    let salida = document.createElement('button')
    salida.textContent = "Salida";

    salida.id = alu_id;

    salida.addEventListener('click', Salida);

    grupo.appendChild(salida)

    tr.appendChild(nombre);
    tr.appendChild(apellidoP);
    tr.appendChild(apellidoM);
    tr.appendChild(status);
    tr.appendChild(grupo);

    registro.appendChild(tr);
}

function borrarTabla() {
    var tabla = document.getElementById('tabla_alumnos');
    var a = tabla.childNodes[1];
    while (tabla.lastChild != a) {
        tabla.removeChild(tabla.lastChild)
    }
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
    var socket = io();

    let ancestro = Ancestro(e.target, 0);
    var id = ancestro.id;

    socket.emit('alumnoEstado4', id, function(res) {
        Status(res.toString(), id);
    });
}


function Status(estado, id) {
    switch (estado) {
        case '1':
            document.getElementById(id).textContent = "EN CASA";
            break;
        case '2':
            document.getElementById(id).textContent = "EN ESCUELA";
            break;
        case '3':
            document.getElementById(id).textContent = "SOLICITUD PENDIENTE";
            break;
        case '4':
            document.getElementById(id).textContent = "EN CAMINO";
            break;
        case '5':
            document.getElementById(id).textContent = "EMERGENCIA";
            break;

        default:
            break;
    }
}