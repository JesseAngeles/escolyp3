let socket = io();
let init = 'emailjs-com';
var params = new URLSearchParams(window.location.search);

if (!params.has('id')) {
    window.location = '../../InicioSesion.html';
}

let id = params.get('id');

function Profesores() {
    window.location = `adm_profesores.html?id=${id}`;
}

function Alumnos() {
    window.location = `adm_alumnos.html?id=${id}`;
}

function Contrasena() {
    window.location = `adm_contrasena.html?id=${id}`;
}

function Salir() {
    window.location = '../../index.html';
}

socket.on('connect', function() {
    socket.emit('adm_obtenerProfesores', function(profesor) {
        borrarTabla();
        if (profesor) {
            for (let i = 0; i < profesor.length; i++) {
                crearRegistro(profesor[i].pro_id, profesor[i].pro_nombre, profesor[i].pro_apellidoP, profesor[i].pro_apellidoM, profesor[i].pro_grupo);
            }
        } else {
            alert('Bienvenido, ingrese los datos del profesor ára agregarlo')
        }
    });

});

socket.on('disconnect', function() {
    window.location = '../index.html'
});

function RegistrarProfesor() {
    let socket = io();

    var profesor = {
        pro_cedula: document.getElementById('pro_cedula').value,
        pro_apellidoP: document.getElementById('pro_apellidoP').value,
        pro_apellidoM: document.getElementById('pro_apellidoM').value,
        pro_nombre: document.getElementById('pro_nombre').value,
        pro_correo: document.getElementById('pro_correo').value,
        pro_contrasena: GeneradorContrasenas()
    }

    let bandera = false;

    let val_cedula = /[A-Z0-9]{7,8}/;
    let val_nombre = /^[A-ZÁ-Ú]{1}[a-zá-ú]{2,19}/;
    let val_correo = /^[a-zA-Z0-9.!#Ññ$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (val_cedula.test(profesor.pro_cedula)) {
        if (val_nombre.test(profesor.pro_nombre)) {
            if (val_nombre.test(profesor.pro_apellidoP)) {
                if (val_nombre.test(profesor.pro_apellidoM)) {
                    if (val_correo.test(profesor.pro_correo)) {
                        bandera = true;
                    }
                }
            }
        }
    }
    if (bandera) {
        socket.on('connect', function() {
            socket.emit('adm_registrarProfesor', profesor, function(res) {
                if (res) {
                    emailjs.send("default_service", "template_qgng8d4", {
                        to_name: `${profesor.pro_nombre} ${profesor.pro_apellidoP} ${profesor.pro_apellidoM}`,
                        message: profesor.pro_contrasena,
                        to_email: profesor.pro_correo,
                    });
                    crearRegistro(profesor.pro_cedula, profesor.pro_nombre, profesor.pro_apellidoP, profesor.pro_apellidoM, );
                } else {
                    alert('El profesor ya se ah registrado.');
                }
            });

        })
    } else {
        alert('Ingrese los datos correctamente');
    }
}

function ActualizarProfesor() {
    let socket = io();

    var profesor = {
        pro_preCedula: document.getElementById('mod_pro_preCedula').value,
        pro_cedula: document.getElementById('mod_pro_cedula').value,
        pro_apellidoP: document.getElementById('mod_pro_apellidoP').value,
        pro_apellidoM: document.getElementById('mod_pro_apellidoM').value,
        pro_nombre: document.getElementById('mod_pro_nombre').value,
        pro_correo: document.getElementById('mod_pro_correo').value,
        pro_contrasena: GeneradorContrasenas()
    }

    let bandera = false;

    let val_cedula = /[A-Z0-9]{7,8}/;
    let val_nombre = /^[A-ZÁ-Ú]{1}[a-zá-ú]{2,19}/;
    let val_correo = /^[a-zA-Z0-9.!#Ññ$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (val_cedula.test(profesor.pro_cedula)) {
        if (val_nombre.test(profesor.pro_nombre)) {
            if (val_nombre.test(profesor.pro_apellidoP)) {
                if (val_nombre.test(profesor.pro_apellidoM)) {
                    if (val_correo.test(profesor.pro_correo)) {
                        bandera = true;
                    }
                }
            }
        }
    }

    if (bandera) {
        socket.on('connect', function() {
            socket.emit('adm_actualizarProfesor', profesor, function(res) {
                if (res) {
                    emailjs.send("default_service", "template_qgng8d4", {
                        to_name: `${profesor.pro_nombre} ${profesor.pro_apellidoP} ${profesor.pro_apellidoM}`,
                        message: profesor.pro_contrasena,
                        to_email: profesor.pro_correo,
                    });
                }
            });

        });
    } else {
        alert('Ingrese los datos correctamente');
    }

    socket.emit('adm_obtenerProfesores', function(profesor) {
        borrarTabla();
        for (let i = 0; i < profesor.length; i++) {
            crearRegistro(profesor[i].pro_id, profesor[i].pro_nombre, profesor[i].pro_apellidoP, profesor[i].pro_apellidoM, profesor[i].pro_grupo);
        }
    });

}

function EliminarProfesor() {
    let socket = io();

    var id = document.getElementById('mod_pro_cedula').value;

    socket.on('connect', function() {
        socket.emit('adm_eliminarProfesor', id, function(res) {
            Profesores();
        });

    });

}

function crearRegistro(pro_cedula, pro_nombre, pro_apellidoP, pro_apellidoM, pro_grupo) {
    const registro = document.querySelector('#tabla_profesores');
    let tr = null;
    tr = document.createElement('tr');

    let cedula = document.createElement('td');
    cedula.textContent = pro_cedula;

    let nombre = document.createElement('td');
    nombre.textContent = pro_nombre;

    let apellidoP = document.createElement('td');
    apellidoP.textContent = pro_apellidoP;

    let apellidoM = document.createElement('td');
    apellidoM.textContent = pro_apellidoM;

    let grupo = document.createElement('td');
    grupo.id = pro_cedula;
    if (pro_grupo) {
        grupo.textContent = pro_grupo;
    } else {
        grupo.textContent = 'ASIGNAR';
    }
    grupo.addEventListener('click', AsignarGrupo)

    let boton = document.createElement('td');
    boton.textContent = "MODIFICAR"
    boton.id = pro_cedula;
    boton.addEventListener('click', Modificar)

    tr.appendChild(cedula);
    tr.appendChild(nombre);
    tr.appendChild(apellidoP);
    tr.appendChild(apellidoM);
    tr.appendChild(grupo);
    tr.appendChild(boton);

    registro.appendChild(tr);
}

function Modificar(e) {
    let socket = io();

    let ancestro = Ancestro(e.target, 0);
    var id = ancestro.id;

    socket.on('connect', function() {
        socket.emit('adm_obtenerProfesor', id, function(profesor) {
            if (profesor) {
                document.getElementById('mod_pro_preCedula').value = profesor[0].pro_id;
                document.getElementById('mod_pro_cedula').value = profesor[0].pro_id;
                document.getElementById('mod_pro_apellidoP').value = profesor[0].pro_apellidoP;
                document.getElementById('mod_pro_apellidoM').value = profesor[0].pro_apellidoM;
                document.getElementById('mod_pro_nombre').value = profesor[0].pro_nombre;
                document.getElementById('mod_pro_correo').value = profesor[0].pro_correo;
            }
        });

    });

}

function AsignarGrupo(e) {
    let socket = io();

    let ancestro = Ancestro(e.target, 0);

    profesor = {
        grupo: document.getElementById('grupo').value,
        id: ancestro.id
    }

    socket.on('connect', function() {
        socket.emit('adm_asignarGrupoProfesor', profesor, function(res) {
            Profesores();
        });

    });
}

function Ancestro(ancestor, level) {
    if (level == 0) {
        return ancestor;
    } else {
        level--;
        return get_acenstors(ancestor.parentElement, level);
    }
}

function borrarTabla() {
    var tabla = document.getElementById('tabla_profesores');
    var a = tabla.childNodes[1];
    while (tabla.lastChild != a) {
        tabla.removeChild(tabla.lastChild)
    }
}

function GeneradorContrasenas() {
    let mayus = "ABCDEFGHJKMNPQRSTUVWXYZ";
    let minus = "abcdefghjkmnpqrstuvwxyz";
    let num = "23456789";
    let contrasena = "";

    for (let i = 0; i < 8; i++) {

        var a = Math.round(Math.random() * (2));
        switch (a) {
            case 0:
                var pre = Math.round(Math.random() * mayus.length);
                contrasena += mayus.substring(pre, pre + 1);
                break;
            case 1:
                var pre = Math.round(Math.random() * minus.length);
                contrasena += minus.substring(pre, pre + 1);
                break;
            case 2:
                var pre = Math.round(Math.random() * num.length);
                contrasena += num.substring(pre, pre + 1);
                break;

            default:
                break;
        }
    }
    return contrasena;
}