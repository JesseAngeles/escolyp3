const { io } = require('../server');

const { DBAlumno } = require('../DBConnection/DBAlumno')
const Alumno = new DBAlumno();

const { DBGrupo } = require('../DBConnection/DBGrupo')
const Grupo = new DBGrupo();

class ProfesorSocket {

    GetAlumnosByGrupo(usu_id, callback) {
        Grupo.GetByUsuarioGrupo(usu_id, (err, res) => {
            if (res) {
                Alumno.GetAllAlumnos((err2,res2) => {
                    var Alumnos = [];
                    res2.forEach(alumno => {
                        if (alumno.gru_id == res.gru_id) {
                            Alumnos.push(alumno);
                        }
                    });
                    return callback(res, Alumnos);
                })
            }
        })
    }

    ListChangeAlumno(alu_id, est_id, callback) {
        switch (est_id) {
            case "1":
                est_id = 2;
                break;
            case "2":
                est_id = 1;
                break;
            default:
                est_id = null;
                break;
        }
        Alumno.SetStatusAlumno(alu_id, est_id, (err, res) => {
            return callback(res);
        })
    }

    ExitAlumno(alu_id, est_id, callback) {
        if (est_id == "3") {
            Alumno.SetStatusAlumno(alu_id, 4, (err, res) => {
                return callback(res);
            })
        }
    }
    GetAlumnosByUsuario(id, callback) {
        Grupo.GetAllGrupos((err, res) => {
            if (res) {
                var grupo;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].usu_id == id) {
                        grupo = res[i];
                        break;
                    }
                }
                if (grupo) {
                    Alumno.GetAllAlumnos((err, res) => {
                        if (res) {
                            var alumnos = [];
                            console.log(grupo);
                            for (let i = 0; i < res.length; i++) {
                                if (res[i].gru_id == grupo.gru_id) {
                                    alumnos.push(res[i]);
                                }
                            }
                            return callback(grupo, alumnos);
                        }
                    })
                } else {
                    return callback(false, false);
                }
            }
        })
    }

    CheckFunctions(callback) {
        Alumno.GetAllAlumnos((err, res) => {
            res.forEach(alumno => {
                if (alumno.est_id == 5) {
                    return callback(true);
                }
            });
        })
    }
}

module.exports = {
    ProfesorSocket
}