const { Conexion } = require('./sen_conexion.js');
var CryptoJS = require("crypto-js");
const clave = "contrasupersecreta"

class Profesores {
    constructor() {};

    registrar(id, nombre, apellidoP, apellidoM, correo, contrasena, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        nombre = CryptoJS.AES.encrypt(nombre, clave).toString();
        apellidoP = CryptoJS.AES.encrypt(apellidoP, clave).toString();
        apellidoM = CryptoJS.AES.encrypt(apellidoM, clave).toString();
        correo = CryptoJS.AES.encrypt(correo, clave).toString();
        contrasena = CryptoJS.AES.encrypt(contrasena, clave).toString();

        let query = conexion.query('INSERT INTO Profesores(pro_id, pro_nombre, pro_apellidoP, pro_apellidoM, pro_correo, pro_contrasena) VALUES (?, ?, ?, ?, ?, ?)', [id, nombre, apellidoP, apellidoM, correo, contrasena], (err, res) => {
            if (err) {
                return callback(false);
            } else {
                return callback(null, true);
            }
        });

        conexion.end();
    }

    eliminar(id, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('DELETE FROM Profesores WHERE pro_id = ?', [id], (err, res) => {
            if (err) {
                return callback(false)
            }
            return callback(null, true);

        });

        conexion.end();
    }

    obtener(id, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('SELECT * FROM Profesores WHERE pro_id = ?', [id], function(err, res) {
            if (err) {
                return callback(false)
            } else {
                if (res.length > 0) {

                    res[0].pro_nombre = CryptoJS.AES.decrypt(res[0].pro_nombre, clave).toString(CryptoJS.enc.Utf8);
                    res[0].pro_apellidoP = CryptoJS.AES.decrypt(res[0].pro_apellidoP, clave).toString(CryptoJS.enc.Utf8);
                    res[0].pro_apellidoM = CryptoJS.AES.decrypt(res[0].pro_apellidoM, clave).toString(CryptoJS.enc.Utf8);
                    res[0].pro_correo = CryptoJS.AES.decrypt(res[0].pro_correo, clave).toString(CryptoJS.enc.Utf8);
                    res[0].pro_contrasena = CryptoJS.AES.decrypt(res[0].pro_contrasena, clave).toString(CryptoJS.enc.Utf8);

                    return callback(null, res)
                } else {
                    return callback(false);
                }
            }
        })

        conexion.end();
    }

    obtenerPorGrupo(grupo, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('SELECT pro_id FROM Profesores WHERE pro_grupo = ?', [grupo], function(err, res) {
            if (err) {
                return callback(false)
            } else {
                if (res.length > 0) {

                    return callback(null, res)

                } else {
                    return callback(false);
                }
            }
        })

        conexion.end();
    }

    obtenerTodos(callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('SELECT * FROM Profesores', [], (err, res) => {
            if (err) {
                return callback(err)
            } else {
                if (res.length > 0) {

                    for (let i = 0; i < res.length; i++) {

                        res[i].pro_nombre = CryptoJS.AES.decrypt(res[i].pro_nombre, clave).toString(CryptoJS.enc.Utf8);
                        res[i].pro_apellidoP = CryptoJS.AES.decrypt(res[i].pro_apellidoP, clave).toString(CryptoJS.enc.Utf8);
                        res[i].pro_apellidoM = CryptoJS.AES.decrypt(res[i].pro_apellidoM, clave).toString(CryptoJS.enc.Utf8);
                        res[i].pro_correo = CryptoJS.AES.decrypt(res[i].pro_correo, clave).toString(CryptoJS.enc.Utf8);
                        res[i].pro_contrasena = CryptoJS.AES.decrypt(res[i].pro_contrasena, clave).toString(CryptoJS.enc.Utf8);
                    }

                    return callback(null, res);
                } else {
                    return callback(false);
                }
            }
        })

        conexion.end();
    }

    actualizar(cedula, nueva_cedula, nombre, apellidoP, apellidoM, correo, contrasena, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        nombre = CryptoJS.AES.encrypt(nombre, clave).toString();
        apellidoP = CryptoJS.AES.encrypt(apellidoP, clave).toString();
        apellidoM = CryptoJS.AES.encrypt(apellidoM, clave).toString();
        correo = CryptoJS.AES.encrypt(correo, clave).toString();
        contrasena = CryptoJS.AES.encrypt(contrasena, clave).toString();

        let query = conexion.query('UPDATE Profesores SET pro_id = ?, pro_nombre = ?, pro_apellidoP = ?, pro_apellidoM = ?, pro_correo = ?, pro_contrasena = ? WHERE pro_id = ?', [nueva_cedula, nombre, apellidoP, apellidoM, correo, contrasena, cedula], (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(null, true);
        })

        conexion.end();
    }

    asignarGrupo(cedula, grupo, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('UPDATE Profesores SET pro_grupo = ? WHERE pro_id = ?', [grupo, cedula], (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(null, true);
        })
    }

    iniciarSesion(correo, contrasena, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        var query = conexion.query('SELECT pro_id, pro_correo, pro_contrasena FROM Profesores', [], (err, res) => {
            if (err) {
                return callback(err);
            } else {
                if (res.length > 0) {

                    for (let i = 0; i < res.length; i++) {
                        res[i].pro_correo = CryptoJS.AES.decrypt(res[i].pro_correo, clave).toString(CryptoJS.enc.Utf8);
                        res[i].pro_contrasena = CryptoJS.AES.decrypt(res[i].pro_contrasena, clave).toString(CryptoJS.enc.Utf8);
                        if (res[i].pro_correo == correo && res[i].pro_contrasena == contrasena) {
                            return callback(null, res[i].pro_id);
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

    actualizarContrasena(cedula, contrasena, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        contrasena = CryptoJS.AES.encrypt(contrasena, clave).toString();

        let query = conexion.query('UPDATE Profesores SET pro_contrasena = ? WHERE pro_id = ?', [contrasena, cedula], (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(null, true);
        })
    }

}

module.exports = {
    Profesores
}