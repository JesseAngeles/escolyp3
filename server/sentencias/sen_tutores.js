const { Conexion } = require('./sen_conexion.js');
var CryptoJS = require("crypto-js");
const clave = "quesearmeunbrawlhalla"

class Tutores {
    constructor() {};

    obtenerUltimo(alu_id, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('SELECT tut_id FROM Tutores WHERE alu_id = ? ORDER BY tut_id DESC LIMIT 1', [alu_id], (err, res) => {
            if (err) {
                return callback(err);
            } else {
                if (res.length <= 0) {
                    callback(null, 0);
                } else {
                    var resultado = res[0].tut_id.toString();
                    resultado = resultado.substring(0, 1);
                    callback(null, resultado);
                }
            }
        })

        conexion.end();
    }

    registrar(alu_id, nombre, apellidoP, apellidoM, correo, contrasena, callback) {
        this.obtenerUltimo(alu_id, (err, id) => {
            if (err) {
                return callback(false);
            }

            if (id >= 3) {
                return callback(false);
            }

            id = parseInt(id, 10) + 1;
            id = id.toString() + alu_id.toString();

            let conexion = new Conexion();
            conexion = conexion.crearConexion();

            nombre = CryptoJS.AES.encrypt(nombre, clave).toString();
            apellidoP = CryptoJS.AES.encrypt(apellidoP, clave).toString();
            apellidoM = CryptoJS.AES.encrypt(apellidoM, clave).toString();
            correo = CryptoJS.AES.encrypt(correo, clave).toString();
            contrasena = CryptoJS.AES.encrypt(contrasena, clave).toString();

            let query = conexion.query('INSERT INTO Tutores(tut_id, alu_id, tut_nombre, tut_apellidoP, tut_apellidoM, tut_correo, tut_contrasena) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, alu_id, nombre, apellidoP, apellidoM, correo, contrasena], (err, res) => {
                if (err) {
                    return callback(false);
                } else {
                    return callback(true);
                }
            });

            conexion.end();
        });
    }

    obtener(id, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('SELECT * FROM Tutores WHERE tut_id = ?', [id], function(err, res) {
            if (err) {
                return callback(false)
            } else {
                if (res.length > 0) {

                    res[0].tut_nombre = CryptoJS.AES.decrypt(res[0].tut_nombre, clave).toString(CryptoJS.enc.Utf8);
                    res[0].tut_apellidoP = CryptoJS.AES.decrypt(res[0].tut_apellidoP, clave).toString(CryptoJS.enc.Utf8);
                    res[0].tut_apellidoM = CryptoJS.AES.decrypt(res[0].tut_apellidoM, clave).toString(CryptoJS.enc.Utf8);
                    res[0].tut_correo = CryptoJS.AES.decrypt(res[0].tut_correo, clave).toString(CryptoJS.enc.Utf8);
                    res[0].tut_contrasena = CryptoJS.AES.decrypt(res[0].tut_contrasena, clave).toString(CryptoJS.enc.Utf8);


                    return callback(null, res);
                } else {
                    return callback(false);
                }
            }
        })

        conexion.end();
    }

    obtenerPorAlumno(id_alu, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('SELECT * FROM Tutores WHERE alu_id = ?', [id_alu], (err, res) => {
            if (err) {
                return callback(false)
            } else {
                if (res.length > 0) {
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].tut_nombre != null) {
                            res[i].tut_nombre = CryptoJS.AES.decrypt(res[i].tut_nombre, clave).toString(CryptoJS.enc.Utf8);
                            res[i].tut_apellidoP = CryptoJS.AES.decrypt(res[i].tut_apellidoP, clave).toString(CryptoJS.enc.Utf8);
                            res[i].tut_apellidoM = CryptoJS.AES.decrypt(res[i].tut_apellidoM, clave).toString(CryptoJS.enc.Utf8);
                            res[i].tut_correo = CryptoJS.AES.decrypt(res[i].tut_correo, clave).toString(CryptoJS.enc.Utf8);
                            res[i].tut_contrasena = CryptoJS.AES.decrypt(res[i].tut_contrasena, clave).toString(CryptoJS.enc.Utf8);
                        }
                    }
                    return callback(null, res);
                } else {
                    return callback(false);
                }
            }
        })

        conexion.end();
    }

    actualizar(id, nombre, apellidoP, apellidoM, correo, contrasena, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let valor = false;

        if (nombre.length == apellidoP.length && apellidoM.length == apellidoP.length && correo.length == contrasena.length) {
            valor = true;
        } else {
            nombre = CryptoJS.AES.encrypt(nombre, clave).toString();
            apellidoP = CryptoJS.AES.encrypt(apellidoP, clave).toString();
            apellidoM = CryptoJS.AES.encrypt(apellidoM, clave).toString();
            correo = CryptoJS.AES.encrypt(correo, clave).toString();
            contrasena = CryptoJS.AES.encrypt(contrasena, clave).toString();

            valor = false;

        }


        let query = conexion.query('UPDATE Tutores SET tut_nombre = ?, tut_apellidoP = ?, tut_apellidoM = ?, tut_correo = ?, tut_contrasena = ? WHERE tut_id = ?', [nombre, apellidoP, apellidoM, correo, contrasena, id], (err, res) => {
            if (err) {
                return callback(err);
            }
            return callback(null, valor);
        })

        conexion.end();
    }

    iniciarSesion(correo, contrasena, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        var query = conexion.query('SELECT tut_id, tut_correo, tut_contrasena FROM Tutores', [], (err, res) => {
            if (err) {
                return callback(err);
            } else {
                if (res.length > 0) {

                    for (let i = 0; i < res.length; i++) {
                        res[i].tut_correo = CryptoJS.AES.decrypt(res[i].tut_correo, clave).toString(CryptoJS.enc.Utf8);
                        res[i].tut_contrasena = CryptoJS.AES.decrypt(res[i].tut_contrasena, clave).toString(CryptoJS.enc.Utf8);
                        if (res[i].tut_correo == correo && res[i].tut_contrasena == contrasena) {
                            return callback(null, res[i].tut_id);
                        }
                    }
                    return callback(null, false);
                } else {
                    return callback(null, false);
                }

            }
        })

        conexion.end();
    }

    actualizarContrasena(id, contrasena, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        contrasena = CryptoJS.AES.encrypt(contrasena, clave).toString();

        let query = conexion.query('UPDATE Tutores SET tut_contrasena = ? WHERE tut_id = ?', [contrasena, id], (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(null, true);
        })
    }
}

module.exports = {
    Tutores
}