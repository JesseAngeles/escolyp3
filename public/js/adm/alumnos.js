var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('id')) {
    alert("No se envio el ID")
    window.location = '../../InicioSesion.html';
}

let id = params.get('id');

function Profesores() {
    window.location = `adm_profesores.html?id=${id}`;
}

function Alumnos() {
    window.location = `adm_alumnos.html?id=${id}`;
}

function Tutores() {
    var socket = io();

    var alu_id = document.getElementById('mod_alu_id').value;
    if (alu_id) {
        socket.emit('adm_registrarTutor', alu_id, function(res) {
            socket.emit('adm_registrarTutor', alu_id, function(res) {
                socket.emit('adm_registrarTutor', alu_id, function(res) {
                    window.location = `adm_tutores.html?id=${id}&alu_id=${alu_id}`;
                });
            });
        });

    } else {
        alert('Seleccione a un alumno');
    }
}

function Contrasena() {
    window.location = `adm_contrasena.html?id=${id}`;
}

function Salir() {
    window.location = '../../index.html';
}

socket.on('connect', function() {
    socket.emit('adm_obtenerGrupos', function(grupos) {
        for (let i = 0; i < grupos.length; i++) {
            listarGrupos(grupos[i]);
        }
    });
});

socket.on('disconnect', function() {
    window.location = '../index.html'
});

function RegistrarAlumno() {
    var socket = io();

    var alu_grupo = document.getElementById('listado_grupos').value;
    socket.emit('adm_obtenerProfesorPorGrupo', alu_grupo, function(res) {
        var alumno = {
            alu_generacion: document.getElementById('alu_generacion').value,
            alu_apellidoP: document.getElementById('alu_apellidoP').value,
            alu_apellidoM: document.getElementById('alu_apellidoM').value,
            alu_nombre: document.getElementById('alu_nombre').value,
            pro_id: res
        }

        let bandera = false;

        let val_generacion = /[0-9]{4}/;
        let val_nombre = /^[A-ZÁ-Ú]{1}[a-zá-ú]{2,19}/;
        if (val_generacion.test(alumno.alu_generacion)) {
            if (val_nombre.test(alumno.alu_nombre)) {
                if (val_nombre.test(alumno.alu_apellidoP)) {
                    if (val_nombre.test(alumno.alu_apellidoM)) {
                        bandera = true;
                    }
                }
            }
        }

        if (bandera) {
            socket.emit('adm_registrarAlumno', alumno, function(res) {
                if (res) {
                    crearRegistro(res, alumno.alu_generacion, alumno.alu_nombre, alumno.alu_apellidoP, alumno.alu_apellidoM, alumno.pro_id);
                }
            });
        } else {
            alert('Ingrese los datos correctamente');
        }
    });
}

function ActualizarAlumno() {
    let socket = io();

    var alu_grupo = document.getElementById('listado_grupos').value;

    socket.emit('adm_obtenerProfesorPorGrupo', alu_grupo, function(res) {
        var alumno = {
            alu_id: document.getElementById('mod_alu_id').value,
            alu_generacion: document.getElementById('mod_alu_generacion').value,
            pro_id: res,
            alu_apellidoP: document.getElementById('mod_alu_apellidoP').value,
            alu_apellidoM: document.getElementById('mod_alu_apellidoM').value,
            alu_nombre: document.getElementById('mod_alu_nombre').value
        }

        let bandera = false;

        let val_generacion = /[0-9]{4}/;
        let val_nombre = /^[A-ZÁ-Ú]{1}[a-zá-ú]{2,19}/;
        if (val_generacion.test(alumno.alu_generacion)) {
            if (val_nombre.test(alumno.alu_nombre)) {
                if (val_nombre.test(alumno.alu_apellidoP)) {
                    if (val_nombre.test(alumno.alu_apellidoM)) {
                        bandera = true;
                    }
                }
            }
        }

        if (bandera) {
            socket.emit('adm_actualizarAlumno', alumno, function(res) {
                Alumnos();
            });
        } else {
            alert('Ingrese los datos correctamente');
        }
    });

}

function EliminarAlumno() {
    let socket = io();

    var id = document.getElementById('mod_alu_id').value;
    socket.on('connect', function() {
        socket.emit('adm_eliminarALumno', id, function(res) {
            if (res) {
                Alumnos();
            }
        });

    });

}

function Modificar(e) {
    let socket = io();

    let ancestro = Ancestro(e.target, 0);
    var id = ancestro.id;

    socket.on('connect', function() {
        socket.emit('adm_obtenerAlumno', id, function(alumno) {
            if (alumno) {
                document.getElementById('mod_alu_id').value = alumno[0].alu_id;
                document.getElementById('mod_alu_generacion').value = alumno[0].alu_generacion;
                document.getElementById('mod_alu_apellidoP').value = alumno[0].alu_apellidoP;
                document.getElementById('mod_alu_apellidoM').value = alumno[0].alu_apellidoM;
                document.getElementById('mod_alu_nombre').value = alumno[0].alu_nombre;
            }
        });

    });
}

function crearRegistro(alu_id, alu_generacion, alu_nombre, alu_apellidoP, alu_apellidoM, alu_grupo) {
    var socket = io();

    const registro = document.querySelector('#tabla_alumnos');
    let tr = null;

    tr = document.createElement('tr');
    tr.id = 'registro';

    let generacion = document.createElement('td');
    generacion.textContent = alu_generacion;

    let nombre = document.createElement('td');
    nombre.textContent = alu_nombre;

    let apellidoP = document.createElement('td');
    apellidoP.textContent = alu_apellidoP;

    let apellidoM = document.createElement('td');
    apellidoM.textContent = alu_apellidoM;

    let grupo = document.createElement('td');
    grupo.id = alu_id;
    if (alu_grupo) {
        socket.emit("adm_obtenerProfesor", alu_grupo, function(res) {
            grupo.textContent = res[0].pro_grupo;

        });
    }

    let boton = document.createElement('td');
    boton.textContent = "MODIFICAR"
    boton.id = alu_id;
    boton.addEventListener('click', Modificar)

    tr.appendChild(generacion);
    tr.appendChild(nombre);
    tr.appendChild(apellidoP);
    tr.appendChild(apellidoM);
    tr.appendChild(grupo);
    tr.appendChild(boton);

    registro.appendChild(tr);
}

function borrarTabla() {
    var tabla = document.getElementById('tabla_alumnos');
    var a = tabla.childNodes[1];
    while (tabla.lastChild != a) {
        tabla.removeChild(tabla.lastChild)
    }
}

function Filtrar() {
    borrarTabla();
    var opcion = document.getElementById('listado_grupos').value;
    if (opcion === "SIN GRUPO") {
        opcion = null;
    }
    socket.emit('adm_obtenerProfesorPorGrupo', opcion, function(res) {
        if (res) {
            socket.emit('adm_obtenerAlumnos', res, function(alumno) {
                if (alumno) {
                    for (let i = 0; i < alumno.length; i++) {
                        crearRegistro(alumno[i].alu_id, alumno[i].alu_generacion, alumno[i].alu_nombre, alumno[i].alu_apellidoP, alumno[i].alu_apellidoM, res);
                    }
                }
            });
        } else {
            socket.emit('adm_obtenerAlumnosSinGrupo', function(alumno) {
                for (let i = 0; i < alumno.length; i++) {
                    crearRegistro(alumno[i].alu_id, alumno[i].alu_generacion, alumno[i].alu_nombre, alumno[i].alu_apellidoP, alumno[i].alu_apellidoM, alumno[i].alu_grupo);
                }
            });
        }
    });
}

function listarGrupos(valor) {
    var registro = document.querySelector('#listado_grupos');
    let opcion = document.createElement('option');
    opcion.textContent = valor;
    opcion.value = valor;

    registro.appendChild(opcion);

}

function Ancestro(ancestor, level) {
    if (level == 0) {
        return ancestor;
    } else {
        level--;
        return get_acenstors(ancestor.parentElement, level);
    }
}