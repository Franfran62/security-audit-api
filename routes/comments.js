const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Route pour afficher les commentaires et le formulaire
router.get('/comments', (req, res) => {
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

// Route pour ajouter un commentaire (vulnérable aux XSS)
router.post('/comments', (req, res) => {
    const { text } = req.body;
    const query = `INSERT INTO comments (text) VALUES ('${text}')`;
    db.query(query, (err) => {
        if (err) throw err;
        res.redirect('/comments');
    });
});

module.exports = router;
