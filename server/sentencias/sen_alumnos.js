const { Conexion } = require('./sen_conexion.js');
var CryptoJS = require("crypto-js");
const clave = "laindesifrablelellaman"

class Alumnos {
    constructor() {};

    obtenerUltimo(generacion, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('SELECT alu_id FROM Alumnos WHERE alu_generacion = ? ORDER BY alu_id DESC LIMIT 1', [generacion], (err, res) => {
            if (err) {
                return callback(err);
            } else {
                if (res.length <= 0) {
                    callback(null, 0);
                } else {
                    var resultado = res[0].alu_id.toString();
                    resultado = resultado.substring(4, );
                    callback(null, resultado);
                }
            }
        })

        conexion.end();
    }

    registrar(generacion, nombre, apellidoP, apellidoM, pro_id, callback) {
        this.obtenerUltimo(generacion, (err, id) => {
            if (err) {
                return console.log(err);
            }

            id = parseInt(id, 10) + 1;

            id = generacion.toString() + id.toString();

            let conexion = new Conexion();
            conexion = conexion.crearConexion();


            nombre = CryptoJS.AES.encrypt(nombre, clave).toString();
            apellidoP = CryptoJS.AES.encrypt(apellidoP, clave).toString();
            apellidoM = CryptoJS.AES.encrypt(apellidoM, clave).toString();

            let query = conexion.query('INSERT INTO Alumnos(alu_id, alu_generacion, alu_nombre, alu_apellidoP, alu_apellidoM, pro_id, alu_estado) VALUES (?, ?, ?, ?, ?, ?, ?)', [id, generacion, nombre, apellidoP, apellidoM, pro_id, '1'], (err, res) => {
                if (err) {
                    return callback(false);
                } else {
                    return callback(null, id);
                }
            });

            conexion.end();
        });
    }

    eliminar(id, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('DELETE FROM Alumnos WHERE alu_id = ?', [id], (err, res) => {
            if (err) {
                return callback(false);
            } else {
                return callback(null, true);
            }
        });

        conexion.end();
    }

    obtener(id, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('SELECT * FROM Alumnos WHERE alu_id = ?', [id], function(err, res) {
            if (err) {
                return callback(false)
            } else {
                if (res.length > 0) {

                    res[0].alu_nombre = CryptoJS.AES.decrypt(res[0].alu_nombre, clave).toString(CryptoJS.enc.Utf8);
                    res[0].alu_apellidoP = CryptoJS.AES.decrypt(res[0].alu_apellidoP, clave).toString(CryptoJS.enc.Utf8);
                    res[0].alu_apellidoM = CryptoJS.AES.decrypt(res[0].alu_apellidoM, clave).toString(CryptoJS.enc.Utf8);
                    return callback(null, res);
                } else {
                    return callback(false);
                }
            }
        })

        conexion.end();
    }

    obtenerPorGrupo(cedula, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('SELECT * FROM Alumnos WHERE pro_id = ?', [cedula], (err, res) => {
            if (err) {
                return callback(false)
            } else {
                if (res.length > 0) {

                    for (let i = 0; i < res.length; i++) {

                        res[i].alu_nombre = CryptoJS.AES.decrypt(res[i].alu_nombre, clave).toString(CryptoJS.enc.Utf8);
                        res[i].alu_apellidoP = CryptoJS.AES.decrypt(res[i].alu_apellidoP, clave).toString(CryptoJS.enc.Utf8);
                        res[i].alu_apellidoM = CryptoJS.AES.decrypt(res[i].alu_apellidoM, clave).toString(CryptoJS.enc.Utf8);
                    }

                    return callback(null, res);
                } else {
                    return callback(false);
                }
            }
        })

        conexion.end();
    }

    obtenerSinGrupo(callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('SELECT * FROM Alumnos WHERE pro_id IS NULL', [], (err, res) => {
            if (err) {
                return callback(false)
            } else {
                if (res.length > 0) {

                    for (let i = 0; i < res.length; i++) {

                        res[i].alu_nombre = CryptoJS.AES.decrypt(res[i].alu_nombre, clave).toString(CryptoJS.enc.Utf8);
                        res[i].alu_apellidoP = CryptoJS.AES.decrypt(res[i].alu_apellidoP, clave).toString(CryptoJS.enc.Utf8);
                        res[i].alu_apellidoM = CryptoJS.AES.decrypt(res[i].alu_apellidoM, clave).toString(CryptoJS.enc.Utf8);
                    }


                    return callback(null, res);
                } else {
                    return callback(false);
                }
            }
        })

        conexion.end();
    }

    actualizar(id, generacion, pro_id, nombre, apellidoP, apellidoM, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        nombre = CryptoJS.AES.encrypt(nombre, clave).toString();
        apellidoP = CryptoJS.AES.encrypt(apellidoP, clave).toString();
        apellidoM = CryptoJS.AES.encrypt(apellidoM, clave).toString();

        let query = conexion.query('UPDATE Alumnos SET alu_generacion = ?, pro_id = ?, alu_nombre = ?, alu_apellidoP = ?, alu_apellidoM = ? WHERE alu_id = ?', [generacion, pro_id, nombre, apellidoP, apellidoM, id], (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(null, true);
        })

        conexion.end();
    }

    asignarGrupo(id, cedula) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('UPDATE Alumnos SET pro_id = ? WHERE alu_id = ?', [cedula, id], (err, res) => {
            if (err) {
                throw err;
            }
        })
    }

    Estado(id, estado, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('UPDATE Alumnos SET alu_estado = ? WHERE alu_id = ?', [estado, id], (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(null, true);
        })

        conexion.end();
    }

    obtenerEstado(id, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('SELECT alu_estado FROM  Alumnos WHERE alu_id = ?', [id], (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(null, res);
        })

        conexion.end();
    }
}

module.exports = {
    Alumnos
}