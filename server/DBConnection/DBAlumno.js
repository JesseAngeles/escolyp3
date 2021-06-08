const { Connection } = require('./Connection.js');

class DBAlumno {
    constructor() { };

    CreateAlumno(usu_id, est_id, alu_nom, alu_app, alu_apm, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();
        
        let query = connection.query('INSERT INTO Alumno(usu_id, est_id, alu_nom, alu_app, alu_apm) VALUES (?, ?, ?, ?, ?)', [usu_id, est_id, alu_nom, alu_app, alu_apm], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                this.GetLastAlumno((err, res) => {
                    if (err) {
                        return callback(false, false);
                    } else {
                        return callback(null, res[0]);
                    }
                })
            }
        })
        connection.end();
    }

    GetLastAlumno(callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT * FROM Alumno ORDER BY alu_id DESC LIMIT 1', (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, res);
            }
        })
        connection.end();
    }

    GetAllAlumnos(callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT * FROM Alumno', (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, res);
            }
        })
        connection.end();
    }

    GetByIdAlumno(alu_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT * FROM Alumno WHERE alu_id = ?', [alu_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, res);
            }
        })
        connection.end();
    }

    UpdateAlumno(alu_id, alu_nom, alu_app, alu_apm, gru_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('UPDATE Alumno SET alu_nom = ?, alu_app = ?, alu_apm = ?, gru_id = ? WHERE alu_id = ?', [alu_nom, alu_app, alu_apm, gru_id, alu_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, this.GetByIdAlumno(alu_id, callback));
            }
        })
        connection.end();
    }

    AssignGrupo(alu_id, gru_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('UPDATE Alumno SET gru_id = ? WHERE alu_id = ?', [gru_id, alu_id], (err, res) => {
            if (err) {
                //console.log(err);
                return callback(false, false);
            } else {
                return callback(null, true);
            }
        })
        connection.end();
    }

    SetStatusAlumno(alu_id, est_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('UPDATE Alumno SET est_id = ? WHERE alu_id = ?', [est_id, alu_id], (err, res) => {
            console.log(err);
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, est_id);
            }
        })
        connection.end();
    }

    DeleteAlumno(alu_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('DELETE FROM Alumno WHERE alu_id = ?', [alu_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, alu_id);
            }
        })
        connection.end();
    }

    ResetStatus(callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('UPDATE Alumno SET est_id = 1', (err, res) => {
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
    DBAlumno
}