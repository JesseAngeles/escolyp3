var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('id') || !params.has('alu_id')) {
    alert("No se envio el ID")
    window.location = '../../InicioSesion.html';
}

let id = params.get('id');
let alu_id = params.get('alu_id');

socket.on('connect', function() {
    socket.emit('adm_obtenerTutores', alu_id, function(res) {
        Llenar(res);
    });

});

socket.on('disconnect', function() {
    window.location = '../index.html'
});

function Regresar() {
    window.location = `adm_alumnos.html?id=${id}`;
}

function Llenar(datos) {
    switch (datos.length) {
        case 0:
            alert('No hay datos del tutor');
            break;
        case 1:
            Llenar1(datos[0]);

            break;
        case 2:
            Llenar1(datos[0]);
            Llenar2(datos[1]);
            break;
        case 3:
            Llenar1(datos[0]);
            Llenar2(datos[1]);
            Llenar3(datos[2]);
            break;
    }
}

function Llenar1(arreglo) {
    document.getElementById('tut_id1').value = arreglo.tut_id;
    document.getElementById('tut_apellidoP1').value = arreglo.tut_apellidoP;
    document.getElementById('tut_apellidoM1').value = arreglo.tut_apellidoM;
    document.getElementById('tut_nombre1').value = arreglo.tut_nombre;
    document.getElementById('tut_correo1').value = arreglo.tut_correo;
}

function Llenar2(arreglo) {
    document.getElementById('tut_id2').value = arreglo.tut_id;
    document.getElementById('tut_apellidoP2').value = arreglo.tut_apellidoP;
    document.getElementById('tut_apellidoM2').value = arreglo.tut_apellidoM;
    document.getElementById('tut_nombre2').value = arreglo.tut_nombre;
    document.getElementById('tut_correo2').value = arreglo.tut_correo;
}

function Llenar3(arreglo) {
    document.getElementById('tut_id3').value = arreglo.tut_id;
    document.getElementById('tut_apellidoP3').value = arreglo.tut_apellidoP;
    document.getElementById('tut_apellidoM3').value = arreglo.tut_apellidoM;
    document.getElementById('tut_nombre3').value = arreglo.tut_nombre;
    document.getElementById('tut_correo3').value = arreglo.tut_correo;
}

function Actualizar() {
    var socket = io();

    let tut = recibirDatos();
    let tut1 = tut.tut1;
    let tut2 = tut.tut2;
    let tut3 = tut.tut3;

    let bandera1 = false;
    let bandera2 = false;
    let bandera3 = false;

    let val_nombre = /^[A-ZÁ-Ú]{1}[a-zá-ú]{2,19}/;
    let val_correo = /^[a-zA-Z0-9.!#Ññ$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (val_nombre.test(tut1.tut_nombre)) {
        if (val_nombre.test(tut1.tut_apellidoP)) {
            if (val_nombre.test(tut1.tut_apellidoM)) {
                if (val_correo.test(tut1.tut_correo)) {
                    bandera1 = true;
                }
            }
        }
    }
    if (tut1.tut_nombre.length == 0 && tut1.tut_apellidoP.length == 0 && tut1.tut_apellidoP.length == 0 && tut1.tut_correo.length == 0) {
        bandera1 = true;
    }

    if (val_nombre.test(tut2.tut_nombre)) {
        if (val_nombre.test(tut2.tut_apellidoP)) {
            if (val_nombre.test(tut2.tut_apellidoM)) {
                if (val_correo.test(tut2.tut_correo)) {
                    bandera2 = true;
                }
            }
        }
    }
    if (tut2.tut_nombre.length == 0 && tut2.tut_apellidoP.length == 0 && tut2.tut_apellidoP.length == 0 && tut2.tut_correo.length == 0) {
        bandera2 = true;
    }

    if (val_nombre.test(tut3.tut_nombre)) {
        if (val_nombre.test(tut3.tut_apellidoP)) {
            if (val_nombre.test(tut3.tut_apellidoM)) {
                if (val_correo.test(tut3.tut_correo)) {
                    bandera3 = true;
                }
            }
        }
    }
    if (tut3.tut_nombre.length == 0 && tut3.tut_apellidoP.length == 0 && tut3.tut_apellidoP.length == 0 && tut3.tut_correo.length == 0) {
        bandera3 = true;
    }

    if (bandera1 && bandera2 && bandera3) {

        let ban1 = true;
        let ban2 = true;
        let ban3 = true;

        socket.emit('adm_obtenerTutores', alu_id, function(res) {

            if (res[0].tut_nombre == tut1.tut_nombre && res[0].tut_apellidoP == tut1.tut_apellidoP && res[0].tut_apellidoM == tut1.tut_apellidoM && res[0].tut_correo == tut1.tut_correo) {
                tut1.tut_contrasena = res[0].tut_contrasena;
            }

            if (res[1].tut_nombre == tut2.tut_nombre && res[1].tut_apellidoP == tut2.tut_apellidoP && res[1].tut_apellidoM == tut2.tut_apellidoM && res[1].tut_correo == tut2.tut_correo) {
                tut2.tut_contrasena = res[1].tut_contrasena;
            }

            if (res[2].tut_nombre == tut3.tut_nombre && res[2].tut_apellidoP == tut3.tut_apellidoP && res[2].tut_apellidoM == tut3.tut_apellidoM && res[2].tut_correo == tut3.tut_correo) {
                tut3.tut_contrasena = res[2].tut_contrasena;
            }

            socket.emit('adm_actualizarTutores', tut1, function(res0) {
                socket.emit('adm_actualizarTutores', tut2, function(res1) {
                    socket.emit('adm_actualizarTutores', tut3, function(res2) {

                        if (!res0) {
                            emailjs.send("default_service", "template_qgng8d4", {
                                to_name: `${tut1.tut_nombre} ${tut1.tut_apellidoP} ${tut1.tut_apellidoM}`,
                                message: tut1.tut_contrasena,
                                to_email: tut1.tut_correo,
                            });
                        }
                        if (!res1) {
                            emailjs.send("default_service", "template_qgng8d4", {
                                to_name: `${tut2.tut_nombre} ${tut2.tut_apellidoP} ${tut2.tut_apellidoM}`,
                                message: tut2.tut_contrasena,
                                to_email: tut2.tut_correo,
                            });
                        }
                        if (!res2) {
                            emailjs.send("default_service", "template_qgng8d4", {
                                to_name: `${tut3.tut_nombre} ${tut3.tut_apellidoP} ${tut3.tut_apellidoM}`,
                                message: tut3.tut_contrasena,
                                to_email: tut3.tut_correo,
                            });
                        }

                    })
                })
            })
        });
    } else {
        alert('Ingrese correctamente todos los datos');
    }

}

function recibirDatos() {
    var tut1 = {
        tut_id: document.getElementById('tut_id1').value,
        tut_apellidoP: document.getElementById('tut_apellidoP1').value,
        tut_apellidoM: document.getElementById('tut_apellidoM1').value,
        tut_nombre: document.getElementById('tut_nombre1').value,
        tut_correo: document.getElementById('tut_correo1').value,
        tut_contrasena: GeneradorContrasenas()
    }

    var tut2 = {
        tut_id: document.getElementById('tut_id2').value,
        tut_apellidoP: document.getElementById('tut_apellidoP2').value,
        tut_apellidoM: document.getElementById('tut_apellidoM2').value,
        tut_nombre: document.getElementById('tut_nombre2').value,
        tut_correo: document.getElementById('tut_correo2').value,
        tut_contrasena: GeneradorContrasenas()
    }

    var tut3 = {
        tut_id: document.getElementById('tut_id3').value,
        tut_apellidoP: document.getElementById('tut_apellidoP3').value,
        tut_apellidoM: document.getElementById('tut_apellidoM3').value,
        tut_nombre: document.getElementById('tut_nombre3').value,
        tut_correo: document.getElementById('tut_correo3').value,
        tut_contrasena: GeneradorContrasenas()
    }

    return { tut1, tut2, tut3 };
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