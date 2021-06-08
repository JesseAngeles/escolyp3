const { io } = require('../server');
const { Conexion } = require('../sentencias/sen_conexion');

const { UsuarioSocket } = require('./UsuarioSocket')
const Usuario = new UsuarioSocket();

const { AdministradorSocket } = require('./AdministradorSocket')
const Administrador = new AdministradorSocket();

const { Administrativos } = require('../sentencias/sen_administrativos');
const administrativo = new Administrativos();

const { Tutores } = require('../sentencias/sen_tutores');
const tutor = new Tutores();

const { Profesores } = require('../sentencias/sen_profesores');
const profesor = new Profesores();

const { Alumnos } = require('../sentencias/sen_alumnos');
alumno = new Alumnos();

io.on('connection', (client) => {

    client.on('disconnect', () => {});


    /*
    INICIOS DE SESION
    */

    client.on('LoginUsuario', (usuario, callback) => {
        Usuario.Login(usuario, (loged_usuario) => {
            return callback(loged_usuario);
        })
    })


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
        Administrador.DeleteUsuario(profesor, (delete_profesor) => {    
            if (delete_profesor) {
                io.emit('lastDeleteProfesor', delete_profesor);         
                return callback(delete_profesor);
            } else {
                return callback(false);
            }
        })
    })

















    // * Reinicia el estatus de todos los alumnos
    client.on('ResetStatus', (callback) => {
        Administrador.ResetStatus((reseted_status) => {
            return callback(reseted_status);
        })
    })


    client.on('adm_validarUsuario', (data, callback) => {
        if (!data.correo || !data.contrasena) {
            return callback(false);
        }

        administrativo.iniciarSesion(data.correo, data.contrasena, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('pro_validarUsuario', (data, callback) => {
        if (!data.correo || !data.contrasena) {
            return callback(false);
        }

        profesor.iniciarSesion(data.correo, data.contrasena, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('tut_validarUsuario', (data, callback) => {
        if (!data.correo || !data.contrasena) {
            return callback(false);
        }

        tutor.iniciarSesion(data.correo, data.contrasena, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    /*
    ADMINISTRADOR 
    */

    client.on('adm_Obtener', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        administrativo.obtener(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_registrarProfesor', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        for (elemento in data) {
            if (data[elemento].length == 0) {
                return false;
            };
        }

        profesor.registrar(data.pro_cedula, data.pro_nombre, data.pro_apellidoP, data.pro_apellidoM, data.pro_correo, data.pro_contrasena, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_obtenerProfesores', (callback) => {
        profesor.obtenerTodos((err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_obtenerGrupos', (callback) => {
        profesor.obtenerTodos((err, res) => {
            if (err) {
                return callback(false);
            }

            let grupos = [];
            let i = 0;

            for (const profesor in res) {
                if (res[profesor].pro_grupo) {
                    grupos[i] = res[profesor].pro_grupo;
                    i++;
                }
            }
            return callback(grupos);

        })

    });

    client.on('adm_obtenerProfesor', (data, callback) => {
        if (!data) {
            return callback(false);
        }
        profesor.obtener(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_obtenerProfesorPorGrupo', (data, callback) => {
        if (!data) {
            return callback(false);
        }
        profesor.obtenerPorGrupo(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res[0].pro_id);
        })

    });

    client.on('adm_eliminarProfesor', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        profesor.eliminar(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_actualizarProfesor', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        for (elemento in data) {
            if (data[elemento].length == 0) {
                return false;
            };
        }

        profesor.actualizar(data.pro_preCedula, data.pro_cedula, data.pro_nombre, data.pro_apellidoP, data.pro_apellidoM, data.pro_correo, data.pro_contrasena, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_asignarGrupoProfesor', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        for (elemento in data) {
            if (data[elemento].length == 0) {
                return false;
            };
        }

        profesor.asignarGrupo(data.id, data.grupo, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_registrarAlumno', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        for (elemento in data) {
            if (data[elemento].length < 0) {
                return false;
            };
        }

        alumno.registrar(data.alu_generacion, data.alu_nombre, data.alu_apellidoP, data.alu_apellidoM, data.pro_id, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_obtenerAlumno', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        alumno.obtener(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_obtenerAlumnos', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        alumno.obtenerPorGrupo(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_obtenerAlumnosSinGrupo', (callback) => {

        alumno.obtenerSinGrupo((err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_actualizarAlumno', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        for (elemento in data) {
            if (data[elemento].length == 0) {
                return false;
            };
        }
        alumno.actualizar(data.alu_id, data.alu_generacion, data.pro_id, data.alu_nombre, data.alu_apellidoP, data.alu_apellidoM, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_eliminarALumno', (data, callback) => {
        if (!data) {
            return callback(false);
        }
        alumno.eliminar(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_obtenerTutores', (data, callback) => {

        tutor.obtenerPorAlumno(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_registrarTutor', (data, callback) => {
        tutor.registrar(data, null, null, null, null, null, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_actualizarTutores', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        let repetir = false;
        let i = 0;
        for (elemento in data) {
            if (data[elemento].length == 0) {
                i++;

                if (i == 5) {
                    repetir = false;
                } else {
                    repetir = true;
                }
            };
        }

        if (repetir) {
            return callback(i);
        }

        tutor.actualizar(data.tut_id, data.tut_nombre, data.tut_apellidoP, data.tut_apellidoM, data.tut_correo, data.tut_contrasena, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('adm_cambiarContrasena', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        for (elemento in data) {
            if (data[elemento].length < 0) {
                return false;
            };
        }

        administrativo.actualizarContrasena(data.id, data.contrasena_nueva, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    /*
    PROFESOR
    */

    client.on('pro_Obtener', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        profesor.obtener(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('pro_obtenerAlumnos', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        alumno.obtenerPorGrupo(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })
    });

    client.on('pro_cambiarContrasena', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        for (elemento in data) {
            if (data[elemento].length < 0) {
                return false;
            };
        }

        profesor.actualizarContrasena(data.id, data.contrasena_nueva, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    /* 
    TUTOR
    */

    client.on('tut_Obtener', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        tutor.obtener(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('tut_cambiarContrasena', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        for (elemento in data) {
            if (data[elemento].length < 0) {
                return false;
            };
        }

        tutor.actualizarContrasena(data.id, data.contrasena_nueva, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    /*
    ALUMNO
    */

    client.on('alu_Obtener', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        alumno.obtener(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res);
        })

    });

    client.on('alumnoEstado1', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        alumno.obtenerEstado(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            let estado = res[0].alu_estado;
            if (estado == 4 || estado == 5) {
                alumno.Estado(data, 1, (err, res) => {
                    if (err) {
                        return callback(false);
                    }
                    Estados(data);
                    return callback(1);
                });
            }

        });
    });

    client.on('alumnoEstado2', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        alumno.obtenerEstado(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            let estado = res[0].alu_estado;
            if (res[0].alu_estado == 1) {
                alumno.Estado(data, 2, (err, res) => {
                    if (err) {
                        return callback(false);
                    }
                    return callback(2);
                });

            }

        });
    });

    client.on('alumnoEstado3', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        alumno.obtenerEstado(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            let estado = res[0].alu_estado;
            if (res[0].alu_estado == 2) {
                alumno.Estado(data, 3, (err, res) => {
                    if (err) {
                        return callback(false);
                    }
                    return callback(3);
                });

            }

        });
    });

    client.on('alumnoEstado4', (data, callback) => {
        if (!data) {
            return callback(false);
        }

        alumno.obtenerEstado(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            let estado = res[0].alu_estado;
            if (res[0].alu_estado == 3) {
                alumno.Estado(data, 4, (err, res) => {
                    if (err) {
                        return callback(false);
                    }
                    return callback(4);
                });

            }

        });
    });

    client.on('alumnoEstado5', (data, callback) => {
        if (!data) {
            return callback(false);
        }
        let estado = res[0].alu_estado;
        alumno.Estado(data, 5, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(5);
        });
    });

    client.on('alumnoEstado', (data, callback) => {
        alumno.obtenerEstado(data, (err, res) => {
            if (err) {
                return callback(false);
            }
            return callback(res[0].alu_estado);
        })
    })

    function Estados() {
        alumno.obtenerEstado(20181, (err, res) => {
            if (err) {
                return false;
            }
            client.emit('datos', res[0].alu_estado, res => {});
        })
    };

});