const { Conexion } = require('./sen_conexion.js');

class Administrativos {
    constructor() {};

    iniciarSesion(correo, contrasena, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        var query = conexion.query('SELECT adm_id FROM Administrativos WHERE adm_correo = ? AND adm_contrasena = ?', [correo, contrasena], (err, res) => {
            if (err) {
                return callback(err);
            } else {
                if (res.length > 0) {
                    return callback(null, res[0].adm_id);
                } else {
                    return callback(null, false);
                }
            }
        });

        conexion.end();
    }

    actualizarContrasena(id, contrasena) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('UPDATE Administrativos SET adm_contrasena = ? WHERE adm_id = ?', [contrasena, id], (err, res) => {
            if (err) {
                return callback(false);
            }

            return true;
        })
    }

    obtener(id, callback) {
        let conexion = new Conexion();
        conexion = conexion.crearConexion();

        let query = conexion.query('SELECT * FROM Administrativos WHERE adm_id = ?', [id], function(err, res) {
            if (err) {
                return callback(err)
            } else {
                if (res.length > 0) {
                    return callback(null, res)
                } else {
                    console.log('No se encontro el registro');
                }
            }
        })

        conexion.end();
    }

}

module.exports = {
    Administrativos
}