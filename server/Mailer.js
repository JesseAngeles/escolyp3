const nodemailer = require('nodemailer');
const { callbackPromise } = require('nodemailer/lib/shared');

const { DBUsuario } = require("./DBConnection/DBUsuario");
const Usuario = new DBUsuario();

const { Token } = require("./Token");
const class_token = new Token();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'escoly.rediax@gmail.com',
        pass: 'EscolyRediaxProgramacion'
    }
});

class Mailer {

    SendEmailRegister(usu_id, usu_cor, usu_con) {
        var token = String(class_token.CreateToken());
        var mensaje = `Contraseña de la plataforma Escoly: ${usu_con} Token:${token}`;

        var mailOptions = {
            from: 'escoly.rediax@gmail.com',
            to: usu_cor,
            subject: 'Registro en Escoly',
            text: mensaje
        };

        transporter.sendMail(mailOptions, function (err, res) { });
        Usuario.SetTokenUsuario(usu_id, token, (err, res) => { });
    }

    SendEmailUpdate(usu_cor, usu_con) {
        var mensaje = `Se ah actualizado su correo electronico, su nueva contraseña es: ${usu_con}`;

        var mailOptions = {
            from: 'escoly.rediax@gmail.com',
            to: usu_cor,
            subject: 'Registro en Escoly',
            text: mensaje
        };

        transporter.sendMail(mailOptions, function (err, res) { });
    }

    SendEmailReport(usu_cor, cri_id, for_tit, for_des) {
        console.log(cri_id);
        switch (cri_id) {
            case "1":
            cri_id = "Comentario";
                break;
            case "2":
                cri_id = "Leve";
                break;
            case "3":
                cri_id = "Moderada";
                break;
            case "4":
                cri_id = "Grave";
                break;
            case "5":
                cri_id = "Urgente";
                break;
            default:
                cri_id = "ERROR";
                break;
        }
        var mensaje = `TICKET DEL REPORTE\nTitulo:${for_tit} \nCriticidad:${cri_id} \nMensaje: ${for_des}`;

        var mailOptions = {
            from: 'escoly.rediax@gmail.com',
            to: usu_cor,
            subject: 'Reporte en el foro',
            text: mensaje
        };

        transporter.sendMail(mailOptions, function (err, res) { });
    }
}

module.exports = {
    Mailer
}
