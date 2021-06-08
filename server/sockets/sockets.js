/*
⠄⠄⠄⢰⣧⣼⣯⠄⣸⣠⣶⣶⣦⣾⠄⠄⠄⠄⡀⠄⢀⣿⣿⠄⠄⠄⢸⡇⠄⠄   ____________________
⠄⠄⠄⣾⣿⠿⠿⠶⠿⢿⣿⣿⣿⣿⣦⣤⣄⢀⡅⢠⣾⣛⡉⠄⠄⠄⠸⢀⣿⠄   |                   |
⠄⠄⢀⡋⣡⣴⣶⣶⡀⠄⠄⠙⢿⣿⣿⣿⣿⣿⣴⣿⣿⣿⢃⣤⣄⣀⣥⣿⣿⠄   |      S-SENPAI     |
⠄⠄⢸⣇⠻⣿⣿⣿⣧⣀⢀⣠⡌⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⣿⣿⣿⠄   |    YOUR CODE IS   |
⠄⢀⢸⣿⣷⣤⣤⣤⣬⣙⣛⢿⣿⣿⣿⣿⣿⣿⡿⣿⣿⡍⠄⠄⢀⣤⣄⠉⠋⣰   |      VERY BIG     |
⠄⣼⣖⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⢇⣿⣿⡷⠶⠶⢿⣿⣿⠇⢀⣤   |                   |
⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣷⣶⣥⣴⣿⡗   /.:_________________|
⢀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠄
⢸⣿⣦⣌⣛⣻⣿⣿⣧⠙⠛⠛⡭⠅⠒⠦⠭⣭⡻⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠄
⠘⣿⣿⣿⣿⣿⣿⣿⣿⡆⠄⠄⠄⠄⠄⠄⠄⠄⠹⠈⢋⣽⣿⣿⣿⣿⣵⣾⠃⠄
⠄⠘⣿⣿⣿⣿⣿⣿⣿⣿⠄⣴⣿⣶⣄⠄⣴⣶⠄⢀⣾⣿⣿⣿⣿⣿⣿⠃⠄⠄
⠄⠄⠈⠻⣿⣿⣿⣿⣿⣿⡄⢻⣿⣿⣿⠄⣿⣿⡀⣾⣿⣿⣿⣿⣛⠛⠁⠄⠄⠄
⠄⠄⠄⠄⠈⠛⢿⣿⣿⣿⠁⠞⢿⣿⣿⡄⢿⣿⡇⣸⣿⣿⠿⠛⠁⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠉⠻⣿⣿⣾⣦⡙⠻⣷⣾⣿⠃⠿⠋⠁⠄⠄⠄⠄⠄⢀⣠⣴
⣿⣿⣿⣶⣶⣮⣥⣒⠲⢮⣝⡿⣿⣿⡆⣿⡿⠃⠄⠄⠄⠄⠄⠄⠄⣠⣴⣿⣿⣿
NICE
*/

const { io } = require('../server');

const { UsuarioSocket } = require('./UsuarioSocket')
const Usuario = new UsuarioSocket();

const { AdministradorSocket } = require('./AdministradorSocket')
const Administrador = new AdministradorSocket();

const { ProfesorSocket } = require('./ProfesorSocket')
const Profesor = new ProfesorSocket();

const { TutorSocket } = require('./TutorSocket')
const Tutor = new TutorSocket();

const { SoporteSocket } = require('./SoporteSocket')
const Soporte = new SoporteSocket();

io.on('connection', (client) => {

    client.on('disconnect', () => {});


    /*
    LOGIN
    */

    client.on('LoginUsuario', (usuario, callback) => {
        Usuario.Login(usuario, (loged_usuario) => {
            return callback(loged_usuario);
        })
    })

    client.on('LoginByTokenUsuario', (token, callback) => {
        Usuario.LoginByToken(token, (loged_usuario) => {
            return callback(loged_usuario);
        })
    })

    client.on('ValidateUsuario', (usu_id, callback) => {
        Usuario.Validate(usu_id, (validated_usuario) => {
            return callback(validated_usuario);
        })
    })

    client.on('ChangePassword', (usu_id, usu_con, new_usu_con, callback) => {
        Usuario.ChangePassword(usu_id, usu_con, new_usu_con, (changed_password) => {
            return callback(changed_password);
        })
    })

    // * Registra a un nuevo profesor
    client.on('createUsuario', (usuario, callback) => {
        Usuario.CreateUsuario(usuario, (new_profesor) => {
            if (new_profesor) {
                io.emit('lastCreateProfesor', new_profesor);
                return callback(new_profesor);
            } else {
                return callback(false);
            }
        })
    });


    /*
     * * DIRECCION: FUNCIONES CORRECTIVAS  
    */

    // * Reinicia el estatus de todos los alumnos
    client.on('ResetStatus', (callback) => {
        Administrador.ResetStatus((reseted_status) => {
            return callback(reseted_status);
        })
    })

    //Pasar de ciclo escolar
    client.on('PassCycle', (callback) => {
        Administrador.PassCycle((passed_cycle) => {
            return callback(passed_cycle);
        })
    })

    /*
     * * DIRECCION: FUNCIONES DE PROFESORES
     */

    // * Conexion de dirección con la interfaz de profesores
    client.on('direccionProfesorConnection', (tip_id, callback) => {
        Administrador.GetAllUsuarios(tip_id, (usuarios) => {
            if (usuarios) {
                Administrador.GetAllGrupos((grupos) => {
                    var usu_gru = "Sin grupo";

                    usuarios.forEach(usuario => {
                        usuario.usu_gru = usu_gru;
                        grupos.forEach(grupo => {
                            if (grupo.usu_id == usuario.usu_id) {
                                usuario.usu_gru = grupo.gru_gra + grupo.gru_nom;
                            }
                        });
                    });
                    return callback(usuarios);
                })
            } else {
                return callback(false);
            }
        })
    })

    // * Conexion de direccion con la interfaz de editar profesores
    client.on('direccionProfesorEditarConnection', (usu_id, callback) => {
        Administrador.GetByIdUsuario(usu_id, (profesor) => {
            if (profesor) {
                Administrador.GetAllGrupos((grupos) => {
                    if (grupos) {
                        return callback(profesor, grupos);
                    } else {
                        return callback(false);
                    }
                })
            } else {
                return callback(false);
            }
        })
    })

    // * Registra a un nuevo profesor
    client.on('createProfesor', (usuario, callback) => {
        Administrador.CreateUsuario(usuario, (new_profesor) => {
            if (new_profesor) {
                io.emit('lastCreateProfesor', new_profesor);
                return callback(new_profesor);
            } else {
                return callback(false);
            }
        })
    });

    // * Actualiza la informacion de un profesor
    client.on('updateProfesor', (profesor, gru_id, changed_email, callback) => {

        Administrador.UpdateUsuario(profesor, changed_email, (update_profesor) => {
            if (update_profesor) {
                Administrador.SetProfesorGrupo(update_profesor.usu_id, gru_id, (grupo) => {
                    if (grupo) {
                        update_profesor.usu_gru = grupo.gru_gra + grupo.gru_nom;
                        update_profesor.gru_id = gru_id;
                    } else {
                        update_profesor.usu_gru = "Sin grupo";
                    }
                    io.emit('lastUpdateProfesor', update_profesor);
                    return callback(true);
                })
            } else {
                setTimeout(function () {
                    return callback(false);
                }, 400);
            }
        })
    })

    // * Elimina a un profesor
    client.on('deleteProfesor', (profesor, callback) => {
        Administrador.DeleteUsuario(profesor, (delete_profesor) => {    //Elimina al profesor de la base de datos
            if (delete_profesor) {
                io.emit('lastDeleteProfesor', delete_profesor);         //Socket de profesor eliminado
                return callback(delete_profesor);
            } else {
                return callback(false);
            }
        })
    })

    /*
    DIRECCION: FUNCIONES DE ALUMNOS Y TUTORES
    */

    // * Conexion de dirección con la interfaz de alumno
    client.on('direccionAlumnoConnection', (callback) => {
        Administrador.GetAllAlumnos((alumnos) => {
            if (alumnos) {
                Administrador.GetAllGrupos((grupos) => {
                    if (grupos) {
                        return callback(alumnos, grupos);
                    } else {
                        return callback(false);
                    }
                })
            } else {
                return callback(false);
            }
        })
    })

    // * Conexion de direccion con la interfaz de editar alumnos
    client.on('direccionAlumnoEditarConnection', (alu_id, callback) => {
        Administrador.GetByIdAlumno(alu_id, (alumno) => {
            if (alumno) {
                Administrador.GetByIdUsuario(alumno.usu_id, (usuario) => {
                    if (usuario) {
                        Administrador.GetAllGrupos((grupos) => {
                            if (grupos) {
                                return callback(alumno, usuario, grupos);
                            } else {
                                return callback(false);
                            }
                        })
                    } else {
                        return callback(false);
                    }
                })
            } else {
                return callback(false);
            }
        })
    })

    // * Registra un nuevo alumno
    client.on('createAlumnoTutor', (alumno, usuario, callback) => {
        Administrador.CreateUsuario(usuario, (new_tutor) => {
            if (new_tutor) {
                Administrador.CreateAlumno(new_tutor.usu_id, alumno, (new_alumno) => {
                    if (new_alumno) {
                        io.emit('lastCreateAlumno', new_alumno);
                        return callback(new_alumno);
                    } else {
                        return callback(false);
                    }
                })
            } else {
                return callback(false);
            }
        })
    })

    // * Actualiza la informacion del alumno
    client.on('updateAlumno', (alumno, tutor, changed_email, callback) => {
        Administrador.UpdateAlumno(alumno, (update_alumno) => {
            if (update_alumno) {
                Administrador.UpdateUsuario(tutor, changed_email, (update_tutor) => {
                    if (update_tutor) {
                        io.emit('lastUpdateAlumno', update_alumno);
                        return callback(true);
                    } else {
                        setTimeout(function () {
                            return callback(false);
                        }, 400);
                    }
                })
            } else {
                setTimeout(function () {
                    return callback(false);
                }, 400);
            }
        })
    })

    // * Elimina a un alumno
    client.on('deleteAlumno', (alumno, tutor, callback) => {
        Administrador.DeleteAlumno(alumno, (res) => {
            if (res) {
                console.log(tutor);
                Administrador.DeleteUsuario(tutor, (res2) => {
                    console.log(res2);
                    if (res2) {
                        io.emit('lastDeleteAlumno', res);
                        return callback(res);
                    } else {
                        setTimeout(function () {
                            return callback(false);
                        }, 400);
                    }
                })
            } else {
                setTimeout(function () {
                    return callback(false);
                }, 400);
            }
        })
    })

    /*
    DIRECCION: FUNCIONES DE GRUPOS
    */

    // * Conexion de direccion con la interfaz de administrar grupos
    client.on('direccionGrupoConnection', (callback) => {
        Administrador.GetAllGrupos((grupos) => {
            if (grupos) {
                return callback(grupos);
            } else {
                return callback(false);
            }
        })
    })

    // * Conexion de direccion con la interfaz de informacion grupos 
    client.on('direccionGrupoInformacionConnection', (gru_id, callback) => {
        Administrador.GetAlumnosByGrupo(gru_id, (alumnos) => {
            if (alumnos) {
                Administrador.GetByIdGrupo(gru_id, (grupo) => {
                    if (grupo) {
                        Administrador.GetAllUsuarios(2, (usuarios) => {
                            usuarios.forEach(usuario => {
                                if (usuario.usu_id == grupo.usu_id) {
                                    return callback(alumnos, usuario);
                                }
                            });
                            return callback(alumnos, false);
                        })
                    }
                })
            }
        })
    })

    // * Conexion de direccion con la interfaz de asignar alumnos
    client.on('direccionGrupoAsignarAlumnoConnection', (callback) => {
        Administrador.GetAllAlumnos((alumnos) => {
            if (alumnos) {
                Administrador.GetAllGrupos((grupos) => {
                    if (grupos) {
                        salumnos = [];
                        alumnos.forEach(alumno => {
                            if (!alumno.gru_id) {
                                salumnos.push(alumno);
                            }
                        });
                        return callback(salumnos, grupos);
                    } else {
                        return callback(false);
                    }
                })
            } else {
                return callback(false);
            }
        })
    })

    // * Conexion de direccion con la interfaz de asignar profesores
    client.on('direccionGrupoAsignarProfesorConnection', (callback) => {
        Administrador.GetAllUsuarios(2, (usuarios) => {
            if (usuarios) {
                Administrador.GetAllGrupos((grupos) => {
                    if (grupos) {
                        return callback(usuarios, grupos);
                    } else {
                        return callback(false);
                    }
                })
            } else {
                return callback(false);
            }
        })
    })

    //Asignacion de alumnos a grupos
    client.on('AssignAlumnos', (alumnos, grupo, callback) => {
        Administrador.AssignAlumnos(alumnos, grupo, (res) => {
            return callback(res);
        })
    })

    //Asignacion de profesores a grupos
    client.on('AssignProfesores', (usuarios, grupos, callback) => {
        Administrador.AssignProfesores(usuarios, grupos, (res) => {
            return callback(res);
        })
    })

    //Creacion de un nuevo grupo
    client.on('createGrupo', (gru_gra, gru_nom, callback) => {
        Administrador.CreateGrupo(gru_gra, gru_nom, (res) => {
            return callback(res);
        })
    })

    //Eliminacion permanente de un grupo
    client.on('deleteGrupo', (gru_id, callback) => {
        Administrador.DeleteGrupo(gru_id, (res) => {
            return callback(res);
        })
    })

    /* 
    DIRECCION: FUNCIONES DE SOPORTE
    */

    client.on('SoporteConnection', (callback) => {
        Soporte.GetAllReports((reports) => {
            if (reports) {
                return callback(reports);
            } else {
                return callback(false);
            }
        })
    })

    client.on('CreateReport', (report, callback) => {
        Usuario.CreateReport(report, (create_report) => {
            if (create_report) {
                io.emit('LastCreateReport', report);
                return callback(create_report);
            } else {
                return callback(false);
            }
        })
    })

    /* 
    PROFESOR: FUNCIONES LISTA
    */

    client.on('ProfesorListaConecction', (usu_id, callback) => {
        Profesor.GetAlumnosByGrupo(usu_id, (grupo, alumnos) => {
            return callback(grupo, alumnos);
        })
    })


    client.on('ProfesorCheckFunctions', (callback) => {
        Profesor.CheckFunctions((flag) => {
            return callback(flag);
        })
    })

    /*
    TUTOR: FUNCIONES SOLICITUD
    */

    client.on('TutorSolicitudConecction', (id, callback) => {
        Tutor.GetAlumnosByTutor(id, (grupos, alumno, profesor) => {
            return callback(grupos, alumno, profesor);
        })
    })

    /*
    ALUMNOS: CAMBIO DE ESTATUS
    */

    //1 a 2 y 2 a 1
    client.on('ListChangeAlumno', (alu_id, est_id, callback) => {
        Profesor.ListChangeAlumno(alu_id, est_id, (new_est_id) => {
            io.emit('LastUpdateStatus', alu_id, new_est_id);
            return callback(new_est_id);
        })
    })

    //2 a 3
    client.on('ExitPetitionAlumno', (alu_id, est_id, callback) => {
        Tutor.ExitPetitionAlumno(alu_id, est_id, (new_est_id) => {
            io.emit('LastUpdateStatus', alu_id, new_est_id);
            return callback(new_est_id)
        })
    })

    //3 a 4
    client.on('ExitAlumno', (alu_id, est_id, callback) => {
        Profesor.ExitAlumno(alu_id, est_id, (new_est_id) => {
            io.emit('LastUpdateStatus', alu_id, new_est_id);
            return callback(new_est_id);
        })
    })

    //4 a 1 y 5 a 1
    client.on('ConfirmExitAlumno', (alu_id, est_id, callback) => {
        Tutor.ConfirmExitAlumno(alu_id, est_id, (new_est_id, flag) => {
            if (flag) {
                io.emit('UnlockFunctions', flag);
            }
            io.emit('LastUpdateStatus', alu_id, new_est_id);
            return callback(new_est_id)
        })
    })

    //3 a 5
    client.on('EmergencyAlumno', (alu_id, est_id, callback) => {
        Tutor.EmergencyAlumno(alu_id, est_id, (new_est_id) => {
            io.emit('LastUpdateStatus', alu_id, new_est_id);
            io.emit('Emergency', alu_id);
            return callback(new_est_id);
        })
    })

});