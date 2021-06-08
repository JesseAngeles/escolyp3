const { Connection } = require('./Connection.js');

class DBForo {
    constructor() { };

    GetAllReports(callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT * FROM Foro', (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, res);
            }
        })
        connection.end();
    }

    CreateReport(usu_id, cri_id, for_tit, for_des, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('INSERT INTO Foro(usu_id, cri_id, for_tit, for_des) VALUES (?, ?, ?, ?)', [usu_id, cri_id, for_tit, for_des], (err, res) => {
            if (err) {
                console.log(err);
                return callback(false, false);
            } else {
                return callback(null, res.insertId);
            }
        })
        connection.end();
    }

    /*

    DeleteGrupo(gru_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('DELETE FROM grupo WHERE gru_id = ?', [gru_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, true);
            }
        })
        connection.end();
    }
    

    GetByIdGrupo(gru_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT * FROM Grupo WHERE usu_id = ?', [gru_id], (err, res) => {
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

        this.DeleteProfesorGrupo(usu_id, (err, res) => {
            if (res) {
                let query = connection.query('UPDATE Grupo SET usu_id = ? WHERE gru_id = ?', [usu_id, gru_id], (err, res) => {
                    if (err) {
                        return callback(false, false);
                    } else if (gru_id) {
                        this.GetByIdGrupo(gru_id, (err, res) => {
                            if (res) {
                                return callback(res[0]);
                            } else {
                                return callback(false);
                            }
                        })   
                    } else {
                        console.log("No tiene grupo");
                        return callback(0);               
                    }
                })
            }
        });
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
    }*/
}

module.exports = {
    DBForo
}