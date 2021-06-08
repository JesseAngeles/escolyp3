DROP DATABASE IF EXISTS DBEscoly;

CREATE DATABASE DBEscoly;

USE DBEscoly;

CREATE TABLE IF NOT EXISTS Administrativos (
    adm_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    adm_nombre VARCHAR(255) NOT NULL,
    adm_correo VARCHAR(255) NOT NULL UNIQUE,
    adm_contrasena VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Profesores (
    pro_id VARCHAR(255) PRIMARY KEY,
    pro_nombre VARCHAR(255) NOT NULL,
    pro_apellidoP VARCHAR(255) NOT NULL,
    pro_apellidoM VARCHAR(255) NOT NULL,
    pro_correo VARCHAR(255) NOT NULL UNIQUE,
    pro_contrasena VARCHAR(255) NOT NULL,
    pro_grupo VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Alumnos (
    alu_id INT UNSIGNED PRIMARY KEY,
    alu_generacion INT UNSIGNED NOT NULL,
    pro_id VARCHAR(255),
    alu_nombre VARCHAR(255) NOT NULL,
    alu_apellidoP VARCHAR(255) NOT NULL,
    alu_apellidoM VARCHAR(255) NOT NULL,
    alu_estado ENUM('1','2','3','4','5'),
    FOREIGN KEY (pro_id) REFERENCES Profesores(pro_id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Tutores (
    tut_id INT UNSIGNED PRIMARY KEY,
    alu_id INT UNSIGNED,
    tut_nombre VARCHAR(255),
    tut_apellidoP VARCHAR(255),
    tut_apellidoM VARCHAR(255),
    tut_correo VARCHAR(255),
    tut_contrasena VARCHAR(255),
    FOREIGN KEY (alu_id) REFERENCES Alumnos(alu_id) ON DELETE CASCADE
);

INSERT INTO Administrativos (adm_nombre, adm_correo, adm_contrasena)
    VALUES("Sui","Sui@gmail.com","k erizo"),
          ("Jesse","Jesse@gmail.com","si pitufa"),
          ("Ian","Ian@gmail.com","k kotorro");
