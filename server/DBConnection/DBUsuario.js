const { Connection } = require('./Connection.js');

class DBUsuario {
    constructor() {};

    LoginUsuario(usu_cor, usu_con, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT usu_id, tip_id FROM Usuario WHERE usu_cor = ? AND usu_con = ?', [usu_cor, usu_con], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, res[0]);
            }
        })
        connection.end();
    }

    LoginByToken(usu_tok, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT usu_id, tip_id FROM Usuario WHERE usu_tok = ?', [usu_tok], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, res[0]);
            }
        })
        connection.end();
    }

    Validate(usu_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT usu_id FROM Usuario WHERE usu_id = ?', [usu_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, true);
            }
        })
        connection.end();
    }

    ChangePassword(usu_id, new_usu_con, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('UPDATE Usuario SET usu_con = ? WHERE usu_id = ?', [new_usu_con, usu_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                if (res.changedRows != 0) {
                    return callback(null, true);
                } else {
                    return callback(false, false);
                }
                
            }
        })
        connection.end();
    }

    CreateUsuario(tip_id, usu_nom, usu_app, usu_apm, usu_cor, usu_con, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('INSERT INTO Usuario(tip_id, usu_nom, usu_app, usu_apm, usu_cor, usu_con) VALUES (?, ?, ?, ?, ?, ?)', [tip_id, usu_nom, usu_app, usu_apm, usu_cor, usu_con], (err, res) => {
            console.log(err);
            if (err) {
                return callback(false, false);
            } else {
                this.GetLastUsuario((err, res) => {
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

    GetLastUsuario(callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT * FROM Usuario ORDER BY usu_id DESC LIMIT 1', (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, res);
            }
        })
        connection.end();
    }

    GetAllUsuarios(callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT * FROM Usuario', (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, res);
            }
        })
        connection.end();
    }

    GetByIdUsuario(usu_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('SELECT * FROM Usuario WHERE usu_id = ?', [usu_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, res);
            }
        })
        connection.end();
    }

    UpdateUsuario(usu_id, usu_nom, usu_app, usu_apm, usu_cor, usu_con, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();
        let query = connection.query('UPDATE Usuario SET usu_nom = ?, usu_app = ?, usu_apm = ?, usu_cor = ?, usu_con = ? WHERE usu_id = ?', [usu_nom, usu_app, usu_apm, usu_cor, usu_con, usu_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else if (res) {
                return callback(null, this.GetByIdUsuario(usu_id, callback));
            } else {
                return callback(false, false);
            }
        })
        connection.end();
    }

    DeleteUsuario(usu_id, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('DELETE FROM Usuario WHERE usu_id = ?', [usu_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, usu_id);
            }
        })
        connection.end();
    }

    SetTokenUsuario(usu_id, usu_tok, callback) {
        var connection = new Connection();
        connection = connection.createTheConnection();

        let query = connection.query('UPDATE Usuario SET usu_tok = ? WHERE usu_id = ?', [usu_tok, usu_id], (err, res) => {
            if (err) {
                return callback(false, false);
            } else {
                return callback(null, true);
            }
        })
    }
}

module.exports = {
    DBUsuario
}