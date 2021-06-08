const { io } = require('../server');

const { DBUsuario } = require('../DBConnection/DBUsuario')
const Usuario = new DBUsuario();

const { DBAlumno } = require('../DBConnection/DBAlumno')
const Alumno = new DBAlumno();

const { DBGrupo } = require('../DBConnection/DBGrupo')
const Grupo = new DBGrupo();

const { Password } = require('../Password')
const password = new Password();

const { Mailer } = require('../Mailer');
const mail = new Mailer();

class AdministradorSocket {

    //USUARIOS

    //Crear usuario
    CreateUsuario(usuario, callback) {
        usuario.usu_con = password.GenerateRandomPassword();
        Usuario.CreateUsuario(usuario.tip_id, usuario.usu_nom, usuario.usu_app, usuario.usu_apm, usuario.usu_cor, usuario.usu_con, (err, res) => {
            if (res) {
                mail.SendEmailRegister(res.usu_id, usuario.usu_cor, usuario.usu_con);
                delete res.usu_con;
                return callback(res);
            }
            return callback(err);
        })
    }

    //Obtener todos los usaurios de un solo tipo
    GetAllUsuarios(tip_id, callback) {
        Usuario.GetAllUsuarios((err, res) => {
            if (res) {
                var usuarios = [];
                res.forEach(usuario => {
                    delete usuario.usu_con;
                    if (usuario.tip_id == tip_id) {
                        usuarios.push(usuario);
                    }
                });
                return callback(usuarios);
            }
            return callback(err);
        })
    }

    //Obtener usuario por su id
    GetByIdUsuario(id, callback) {
        Usuario.GetByIdUsuario(id, (err, res) => {
            if (res) {
                delete res[0].usu_con;
                return callback(res[0]);
            }
            return callback(err);

        })
    }

    //Obtener la contraseña de n usuario
    GetPasswordUsuario(id, changed_email, callback) {
        if (changed_email) {
            return callback(password.GenerateRandomPassword());
        } else {
            Usuario.GetByIdUsuario(id, (err, res) => {
                if (res) {
                    return callback(res[0].usu_con);
                }
            })
        }
    }

    //Actualiza la informacion de un usuario
    UpdateUsuario(usuario, changed_email, callback) {
        this.GetPasswordUsuario(usuario.usu_id, changed_email, (last_password) => {
            usuario.usu_con = last_password;
            Usuario.UpdateUsuario(usuario.usu_id, usuario.usu_nom, usuario.usu_app, usuario.usu_apm, usuario.usu_cor, usuario.usu_con, (err, res) => {
                if (res) {
                    if (changed_email) {
                        mail.SendEmailUpdate(usuario.usu_cor, usuario.usu_con);
                    }
                    console.log(res[0]);
                    return callback(res[0]);
                } else {
                    return callback(err);
                }
            })
        });
    }

    //Elimina la informacion de un usuario
    DeleteUsuario(id, callback) {
        Grupo.DeleteProfesorGrupo(id, (err, res) => {
            Usuario.DeleteUsuario(id, (err, res) => {
                if (res) {
                    return callback(res);
                }
                return callback(err);
            })
        })
    }

    //ALUMNOS

    //Crea un nuevo alumno
    CreateAlumno(usu_id, alumno, callback) {
        Alumno.CreateAlumno(usu_id, alumno.est_id, alumno.alu_nom, alumno.alu_app, alumno.alu_apm, (err, res) => {
            if (res) {
                return callback(res);
            }
            return callback(err);
        })
    }

    //Obtiene a todos los alumnos
    GetAllAlumnos(callback) {
        Alumno.GetAllAlumnos((err, res) => {
            if (res) {
                return callback(res);
            }
            return callback(err);
        })
    }

    //Obtiene a un alumno por su id
    GetByIdAlumno(id, callback) {
        Alumno.GetByIdAlumno(id, (err, res) => {
            if (res) {
                return callback(res[0]);
            }
            return callback(err);

        })
    }

    //Actualiza la informacion de un alumno
    UpdateAlumno(alumno, callback) {
        Alumno.UpdateAlumno(alumno.alu_id, alumno.alu_nom, alumno.alu_app, alumno.alu_apm, alumno.gru_id, (err, res) => {
            if (res) {
                return callback(res[0]);
            }
            return callback(err);
        })
    }

    //Elimina la informacion de un alumno
    DeleteAlumno(id, callback) {
        Alumno.DeleteAlumno(id, (err, res) => {
            if (res) {
                return callback(res);
            }
            return callback(err);
        })
    }

    //Reinicia el estatus de todos los alumnos
    ResetStatus(callback) {
        Alumno.ResetStatus((err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })
    }

    //GRUPOS

    //Obtiene todos los grupos
    GetAllGrupos(callback) {
        Grupo.GetAllGrupos((err, res) => {
            if (res) {
                return callback(res);
            }
            return callback(err);
        })
    }

    //Crea un nuevo grupo
    CreateGrupo(gru_gra, gru_nom, callback) {
        Grupo.CreateGrupo(gru_gra, gru_nom, (err, res) => {
            if (res) {
                return callback(res);
            }
        })
    }

    //Elimina la informacion de todo un grupo
    DeleteGrupo(gru_id, callback) {
        Grupo.DeleteGrupo(gru_id, (err, res) => {
            if (res) {
                return callback(res);
            }
        })
    }

    //Asigna un profesor al grupo
    SetProfesorGrupo(usu_id, gru_id, callback) {
        Grupo.DeleteProfesorGrupo(usu_id, callback);
        if (!gru_id) {
            gru_id = null;
        } else {
            Grupo.SetProfesorGrupo(usu_id, gru_id, (err, res) => {
                if (res) {
                    return callback(res);
                }
                return callback(err);
            })
        }
    }

    //Obtiene a los alumnos por su grupo
    GetAlumnosByGrupo(gru_id, callback) {
        Alumno.GetAllAlumnos((err, res) => {
            var alumnos = [];
            if (res) {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].gru_id == gru_id) {
                        alumnos.push(res[i]);
                    }
                }
                return callback(alumnos);
            }
        })
    }

    //Obtiene el grupo por su id
    GetByIdGrupo(id, callback) {
        Grupo.GetByIdGrupo(id, (err, res) => {
            if (res) {
                return callback(res[0]);
            }
            return callback(err);

        })
    }

    //Asigna los alumnos a su grupo
    AssignAlumnos(alumnos, grupo, callback) {
        var is = [];
        for (let i = 0; i < alumnos.length; i++) {
            Alumno.AssignGrupo(alumnos[i], grupo, (err, res) => {
                is.push(res);
            });
        }
        return callback(true);
    }

    //Asigna los pofesores a sus grupos
    AssignProfesores(usuarios, grupos, callback) {
        for (let i = 0; i < usuarios.length; i++) {
            Grupo.DeleteProfesorGrupo(usuarios[i], callback);
            Grupo.SetProfesorGrupo(usuarios[i], grupos[i], (err, res) => {
            })
        }
        return callback(true);
    }

    //Pasa el ciclo escolar
    PassCycle(callback) {
        var validation = true;
        this.GetAllGrupos((grupos => {
            grupos.forEach(grupo => {
                grupo.gru_gra++;
                if (grupo.gru_gra > 6) {
                    grupo.gru_gra = 1;
                }
                Grupo.UpdateGrupo(grupo.gru_id, grupo.gru_gra, (err, res) => {
                    if (err) {
                        validation = false;
                    }
                })
            });
        }))
        return callback(validation);
    }
}

module.exports = {
    AdministradorSocket
}