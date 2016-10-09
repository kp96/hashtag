const mysql = require("mysql");
const Promise = require("bluebird");

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

const pool  = mysql.createPool(require('./config').dbLocal);

const getSqlConnection = function() {
    return pool.getConnectionAsync().disposer(function(connection) {
        connection.release();
    });
}

module.exports = getSqlConnection;