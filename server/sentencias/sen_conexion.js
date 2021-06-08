class Conexion {
    constructor() {
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: 'bzcvdrwpz9esfkursipg-mysql.services.clever-cloud.com',
            user: 'uax4hgdph5r1wen4',
            password: 'nEmZnyxIL9OV0WqaISmX',
            database: 'bzcvdrwpz9esfkursipg',
            port: 3306
        })
    };

    crearConexion() {
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: 'bzcvdrwpz9esfkursipg-mysql.services.clever-cloud.com',
            user: 'uax4hgdph5r1wen4',
            password: 'nEmZnyxIL9OV0WqaISmX',
            database: 'bzcvdrwpz9esfkursipg',
            port: 3306
        });
        connection.connect((err) => {
            if (err) {
                throw err;
            }
        });
        return connection;
    };
}

module.exports = {
    Conexion
}