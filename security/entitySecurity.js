const db = require('../config/database'); 

function entityExists(table, data) {
    return new Promise((resolve, reject) => {
        let query;
        let values;

        if (data.id) {
            query = `SELECT COUNT(*) as count FROM ${table} WHERE id = ?`;
            values = [data.id];
        } else {
            const keys = Object.keys(data).map(key => `${key} = ?`).join(' AND ');
            values = Object.values(data);
            query = `SELECT COUNT(*) as count FROM ${table} WHERE ${keys}`;
        }

        db.query(query, values, (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'exécution de la requête:', err);
                return reject(err);
            }
            resolve(results[0].count > 0);
        });
    });
}

module.exports = { entityExists };
