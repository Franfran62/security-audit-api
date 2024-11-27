
const db = require('../config/database');

function addHebergement(numero, capacite, type, prix_haute_saison, prix_basse_saison) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO hebergement (numero, capacite, type, prix_haute_saison, prix_basse_saison)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [numero, capacite, type, prix_haute_saison, prix_basse_saison];
        db.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ id: result.insertId, numero, capacite, type, prix_haute_saison, prix_basse_saison });
        });
    });
}

function updateHebergement(id, updateData) {
    return new Promise((resolve, reject) => {
        const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateData), id];
        const query = `UPDATE hebergement SET ${setClause} WHERE id = ?`;
        db.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ id, ...updateData });
        });
    });
}

function fetchAllHebergements() {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM hebergement`;
        db.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

module.exports = { addHebergement, updateHebergement, fetchAllHebergements };