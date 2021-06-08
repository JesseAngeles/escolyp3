const { io } = require('../server');

const { DBUsuario } = require('../DBConnection/DBUsuario')
const Usuario = new DBUsuario();

const { DBAlumno } = require('../DBConnection/DBAlumno')
const Alumno = new DBAlumno();

const { DBGrupo } = require('../DBConnection/DBGrupo')
const Grupo = new DBGrupo();

class TutorSocket {

    GetAlumnosByTutor(usu_id, callback) {
        console.log(usu_id);
        Alumno.GetAllAlumnos((err, res) => {
            var Alumno = [];
            res.forEach(alumno => {
                if (alumno.usu_id == usu_id) {
                    Alumno = alumno;
                }
            });
            Grupo.GetAllGrupos((err2, res2) => {
                Usuario.GetAllUsuarios((err1, res1) => {
                    res2.forEach(grupo => {
                        if (grupo.gru_id == Alumno.gru_id) {
                            res1.forEach(usuario => {
                                if (grupo.usu_id == usuario.usu_id) {
                                    return callback(grupo, Alumno, usuario);
                                }
                            });
                        }
                    });
                })

            })
        })
    }

    ExitPetitionAlumno(alu_id, est_id, callback) {
        if (est_id == 2) {
            Alumno.SetStatusAlumno(alu_id, 3, (err, res) => {
                return callback(res);
            })   
        } else {
            return callback(false);
        }
    }

    ConfirmExitAlumno(alu_id, est_id, callback) {
        if (est_id == 4 || est_id == 5) {
            Alumno.SetStatusAlumno(alu_id, "1", (err, res) => {
                if (est_id == 5) {
                    return callback(1, true);
                } else {
                    return callback(1, false);
                }
            })
        } else {
            return callback(false);
        }
    }

    EmergencyAlumno(alu_id, est_id, callback) {
        if (est_id == 4) {
            Alumno.SetStatusAlumno(alu_id, 5, (err, res) => {
                return callback(res);
            })
        } else {
            return callback(false);
        }
    }
}

module.exports = {
    TutorSocket
}