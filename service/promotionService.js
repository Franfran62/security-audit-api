
const db = require('../config/database');

function addPromotion(nom, remise) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO promotion (nom, remise)
            VALUES (?, ?)
        `;
        const values = [nom, remise];
        db.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ id: result.insertId, nom, remise });
        });
    });
}

function updatePromotion(id, updateData) {
    return new Promise((resolve, reject) => {
        const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateData), id];
        const query = `UPDATE promotion SET ${setClause} WHERE id = ?`;
        db.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ id, ...updateData });
        });
    });
}

function fetchAllPromotions() {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM promotion`;
        db.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

module.exports = { addPromotion, updatePromotion, fetchAllPromotions };