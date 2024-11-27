const db = require('../config/database');
const { entityExists } = require('../security/entitySecurity.js'); 

function addReservation(date_reservation, date_entree, date_sortie, hebergement_id, user_id, nom, prix, solde_restant) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO reservation (date_reservation, date_entree, date_sortie, hebergement_id, user_id, nom, prix, solde_restant)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [date_reservation, date_entree, date_sortie, hebergement_id, user_id, nom, prix, solde_restant];
        db.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ id: result.insertId, date_reservation, date_entree, date_sortie, hebergement_id, user_id, nom, prix, solde_restant });
        });
    });
}

function updateReservation(id, updateData) {
    return new Promise((resolve, reject) => {
        const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateData), id];
        const query = `UPDATE reservation SET ${setClause} WHERE id = ?`;
        db.query(query, values, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({ id, ...updateData });
        });
    });
}

function getReservationsByUser(userId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM reservation WHERE user_id = ?`;
        db.query(query, [userId], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

function getReservationsByEmail(email) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.* FROM reservation r
            JOIN users u ON r.user_id = u.id
            WHERE u.email = ?
        `;
        db.query(query, [email], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

module.exports = { addReservation, updateReservation, entityExists, getReservationsByUser, getReservationsByEmail };