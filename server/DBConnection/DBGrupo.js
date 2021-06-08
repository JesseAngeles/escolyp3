const { Connection } = require('./Connection.js');

class DBGrupo {
    constructor() { };

    CreateGrupo(gru_gra, gru_nom, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('INSERT INTO grupo(gru_gra, gru_nom) VALUES (?, ?)', [gru_gra, gru_nom], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, res.insertId);
            }
        })
        connection.end();
    }

    DeleteGrupo(gru_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();
        let query = connection.query('UPDATE Alumno SET gru_id = null WHERE gru_id = ?', [gru_id]);
        let query2 = connection.query('DELETE FROM grupo WHERE gru_id = ?', [gru_id], (err2, res2) => {
            if (err2) {
                return callback(false, false);
            } else {
                return callback(null, true);
            }
        })
        connection.end();
    }

    GetAllGrupos(callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT * FROM Grupo', (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, res);
            }
        })
        connection.end();
    }

    GetByIdGrupo(gru_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT * FROM Grupo WHERE gru_id = ?', [gru_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, res);
            }
        })
        connection.end();
    }

    SetProfesorGrupo(usu_id, gru_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query(`UPDATE Grupo SET usu_id = ? WHERE gru_id = ?`, [usu_id, gru_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                this.GetByIdGrupo(gru_id, (err2, res2) => {
                    if (res2) {
                        return callback(res2[0]);
                    } else {
                        return callback(false);
                    }
                })
            } 
        })
        connection.end();
    }

    DeleteProfesorGrupo(usu_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('UPDATE Grupo SET usu_id = NULL WHERE usu_id = ?', [usu_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, true);
            }
        })
        connection.end();
    }

    GetByUsuarioGrupo(usu_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT * FROM Grupo WHERE usu_id = ?', [usu_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, res[0]);
            }
        })
        connection.end();
    }

    UpdateGrupo(gru_id, gru_gra, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('UPDATE grupo SET gru_gra = ? WHERE gru_id = ?', [gru_gra, gru_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, true);
            }
        })
        connection.end();
    }
}

module.exports = {
    DBGrupo
}