/*
https://console.clever-cloud.com/users/me/addons/addon_3a42f374-1a45-4da1-aa32-4c3f16499282
wah.ortiz.sui.som@gmail.com
*/

DROP DATABASE IF EXISTS Escoly;

CREATE DATABASE Escoly;

USE Escoly;

CREATE TABLE Tipo(
    tip_id INTEGER(1) NOT NULL,
    tip_nom VARCHAR(50) NOT NULL,
    PRIMARY KEY(tip_id)
);

INSERT INTO Tipo(tip_id, tip_nom) 
VALUES (1, "Administrador"),
        (2, "Profesor"),
        (3, "Tutor");

CREATE TABLE Estatus(
    est_id INTEGER(1) NOT NULL,
    est_nom VARCHAR(50) NOT NULL,
    PRIMARY KEY(est_id)
);

INSERT INTO Estatus(est_id, est_nom)
VALUES (1, "Casa"),
        (2, "Escuela"),
        (3, "Solicitud"),
        (4, "En camino"),
        (5, "Emergencia");
        
CREATE TABLE Criticidad(
    cri_id INTEGER(1) NOT NULL,
    cri_nom VARCHAR(50) NOT NULL,
    PRIMARY KEY(cri_id)
);

INSERT INTO Criticidad(cri_id, cri_nom)
VALUES (1, "Comentario"),
        (2, "Baja importancia"),
        (3, "Media importancia"),
        (4, "Importante"),
        (5, "urgente");

CREATE TABLE Usuario(
    usu_id INTEGER(5) NOT NULL AUTO_INCREMENT,
    tip_id INTEGER(1) NOT NULL,
    usu_nom VARCHAR(255) NOT NULL,
    usu_app VARCHAR(255) NOT NULL,
    usu_apm VARCHAR(255) NOT NULL, 
    usu_cor VARCHAR(255) NOT NULL UNIQUE,
    usu_con VARCHAR(255) NOT NULL,
    usu_tok VARCHAR(255),
    PRIMARY KEY(usu_id),
    FOREIGN KEY (tip_id) REFERENCES Tipo(tip_id) 
);

CREATE TABLE Grupo(
    gru_id INTEGER(5) NOT NULL AUTO_INCREMENT,
    usu_id INTEGER(5) UNIQUE,
    gru_gra INTEGER(1) NOT NULL,
    gru_nom CHAR NOT NULL,
    PRIMARY KEY(gru_id),
    FOREIGN KEY (usu_id) REFERENCES Usuario(usu_id)
);

INSERT INTO Grupo(gru_gra, gru_nom) 
VALUES (1, "A"),
        (2, "A"),
        (3, "A"),
        (4, "A"),
        (5, "A"),
        (6, "A");

CREATE TABLE Alumno(
    alu_id INTEGER(5) NOT NULL AUTO_INCREMENT,
    gru_id INTEGER(5),
    usu_id INTEGER(5) NOT NULL,
    est_id INTEGER(1) NOT NULL,
    alu_nom VARCHAR(255) NOT NULL,
    alu_app VARCHAR(255) NOT NULL,
    alu_apm VARCHAR(255) NOT NULL,
    PRIMARY KEY(alu_id),
    FOREIGN KEY (gru_id) REFERENCES Grupo(gru_id),
    FOREIGN KEY (usu_id) REFERENCES Usuario(usu_id) ON DELETE CASCADE,
    FOREIGN KEY (est_id) REFERENCES Estatus(est_id)
);

CREATE TABLE Foro(
    for_id INTEGER(5) NOT NULL AUTO_INCREMENT,
    usu_id INTEGER(5) NOT NULL,
    cri_id INTEGER(1) NOT NULL,
    for_tit VARCHAR(255) NOT NULL,
    for_des VARCHAR(255) NOT NULL,
    PRIMARY KEY(for_id),
    FOREIGN KEY (usu_id) REFERENCES Usuario(usu_id) ON DELETE CASCADE, 
    FOREIGN KEY (cri_id) REFERENCES Criticidad(cri_id)
);

insert into Usuario(usu_id, tip_id, usu_nom, usu_app, usu_apm, usu_cor, usu_con)
VALUES (1, 1, "Erick Jesse", "Angeles", "López", "kronorium4741@gmail.com", "12345678"),
        (2, 1, "Sui Som", "Wah", "Ortiz", "wah.ortiz.sui.som@gmail.com", "12345678");

SHOW TABLES;

DESC tipo;
DESC estatus;
DESC Criticidad;
DESC usuario;
DESC grupo;
DESC alumno;
DESC Foro;




