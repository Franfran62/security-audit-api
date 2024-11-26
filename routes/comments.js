const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { containsBannedWord } = require('../security/inputSecurity');
const verifyToken = require('../security/jsonWebToken');

// Route pour afficher les commentaires et le formulaire
router.get('/comments', verifyToken, (req, res) => {
    db.query('SELECT * FROM comments', (err, results) => {
        if (err) throw err;
        const commentsHTML = results.map(comment => `<p>${comment.text}</p>`).join('');
        res.send(`
            <form method="post" action="/comments">
                <textarea name="text" placeholder="Your comment"></textarea>
                <button type="submit">Post Comment</button>
            </form>
            ${commentsHTML}
        `);
    });
});

// Route pour ajouter un commentaire (vulnérable aux XSS) : plus maintenant eheh
router.post('/comments', verifyToken, (req, res) => { 
    const { text } = req.body;
    if (containsBannedWord(text)) {
        return res.status(400).send('Le commentaire n\'est pas correct.');
    }
    const query = 'INSERT INTO comments (text) VALUES (?)';
    db.query(query, [text], (err) => {
        if (err) {
            return res.status(500).send('Une erreur est survenue lors de l\'ajout du commentaire. Veuillez réessayer plus tard.');
        }
        res.redirect('/comments');
    });
});

module.exports = router;
