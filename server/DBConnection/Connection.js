class Connection {
    constructor() {
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: "bqxihmdx7kukedlpchec-mysql.services.clever-cloud.com",
            user: "urzgj6sbicqxm251",
            password: "Em0IyhJoKGR2HcSJmdZh",
            database: "bqxihmdx7kukedlpchec",
            port: 3306
        })
    };

    createTheConnection() {
        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: "bqxihmdx7kukedlpchec-mysql.services.clever-cloud.com",
            user: "urzgj6sbicqxm251",
            password: "Em0IyhJoKGR2HcSJmdZh",
            database: "bqxihmdx7kukedlpchec",
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
    Connection
}