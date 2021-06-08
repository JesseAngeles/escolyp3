var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('id')) {
    alert("No se envio el ID")
    window.location = '../../InicioSesion.html';
}

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
        }
    })
});

socket.on('disconnect', function() {
    window.location = '../index.html'
});

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

    let grupo = document.createElement('td');

    let presente = document.createElement('button')
    presente.textContent = "Presente";

    let ausente = document.createElement('button')
    ausente.textContent = "Ausente";

    presente.id = alu_id;
    ausente.id = alu_id;

    presente.addEventListener('click', Presente);
    ausente.addEventListener('click', Ausente);

    grupo.appendChild(presente)
    grupo.appendChild(ausente)

    tr.appendChild(nombre);
    tr.appendChild(apellidoP);
    tr.appendChild(apellidoM);
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

function Presente(e) {
    var socket = io();

    let ancestro = Ancestro(e.target, 0);
    var id = ancestro.id;

    socket.emit('alumnoEstado2', id, function(res) {
        console.log(res);
    });
}

function Ausente(e) {
    let ancestro = Ancestro(e.target, 0);
    var id = ancestro.id;

    socket.emit('alumnoEstado1', id, function(res) {
        console.log(res);
    });
}