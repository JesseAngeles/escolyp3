const { io } = require('../server');

const { DBUsuario } = require('../DBConnection/DBUsuario')
const Usuario = new DBUsuario();

const { DBForo } = require('../DBConnection/DBForo')
const Foro = new DBForo();

class SoporteSocket {

    CreateReport(report, callback){
        Foro.CreateReport(usu_id, report.cri_id, report.for_tit, report.for_des, (err, res) => {
            Usuario.GetByIdUsuario(report.usu_id, (err2, res2) => {
                console.log(res2.usu_cor);
            })
            return callback(res);
        })
    }

    GetAllReports(callback){
        Foro.GetAllReports((err, res) => {
            return callback(res);
        })
    }
}

module.exports = {
    SoporteSocket
}