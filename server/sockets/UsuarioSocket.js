const { DBUsuario } = require('../DBConnection/DBUsuario')
const Usuario = new DBUsuario();

/*const { DBForo } = require('../DBConnection/DBForo')
const Foro = new DBForo();

const { Mailer } = require('../Mailer');
const mail = new Mailer();

const { Password } = require('../Password');
const password = new Password();*/

class UsuarioSocket {

    Login(usuario, callback) {
        Usuario.LoginUsuario(usuario.usu_cor, usuario.usu_con, (err, res) => {
            if (err) {
                return callback(false);
            } else {
                console.log(res);
                return callback(res);
            }
        })
    }


    LoginByToken(token, callback) {
        Usuario.LoginByToken(token, (err, res) => {
            if (err) {
                return callback(false);
            } else {
                if (res) {
                }
                return callback(res);
            }
        })
    }


    Validate(usu_id, callback) {
        Usuario.GetByIdUsuario(usu_id, (err, res) => {
            if (err) {
                return callback(false);
            } else {
                return callback(res[0]);
            }
        })
    }

    ChangePassword(usu_id, usu_con, new_usu_con, callback) {
        Usuario.GetByIdUsuario(usu_id, (err, res) => {
            if (res) {
                res = res[0];
                console.log(res);
                console.log(res.usu_con, usu_con);
                if (res.usu_con == usu_con) {
                    Usuario.ChangePassword(usu_id, new_usu_con, (err, res) => {
                        if (err) {
                            return callback(false);
                        } else {
                            return callback(res);
                        }
                    })
                } else if (res.usu_tok == usu_con) {
                    Usuario.ChangePassword(usu_id, new_usu_con, (err, res) => {
                        if (err) {
                            return callback(false);
                        } else {
                            return callback(res);
                        }
                    })
                }
            } else {
                return callback(false);
            }
        })
    }

    CreateReport(report, callback) {
        Foro.CreateReport(report.usu_id, report.cri_id, report.for_tit, report.for_des, (err, res) => {
            Usuario.GetByIdUsuario(report.usu_id, (err2, res2) => {
                if (res2) {
                    var correo = res2[0].usu_cor;
                    mail.SendEmailReport(correo, report.cri_id, report.for_tit, report.for_des);
                }
            })
            return callback(res);
        })
    }

    CreateUsuario(usuario, callback) {
        usuario.usu_con = password.GenerateRandomPassword();
        Usuario.CreateUsuario(usuario.tip_id, usuario.usu_nom, usuario.usu_app, usuario.usu_apm, usu_cor, usu_con, (err, res) => {
            if (res) {
                mail.SendEmailRegister(res.usu_id, usuario.usu_cor, usuario.usu_con);
                delete res.usu_con;
                return callback(res);
            }
            return callback(err);
        })
    }
}

module.exports = {
    UsuarioSocket
}