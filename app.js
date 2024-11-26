
require('express')();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'vulnerableSecret',
    resave: false,
    saveUninitialized: true
}));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to database');
    }
});

// Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth')); // Ajout des routes d'authentification
app.use('/', require('./routes/comments')); // Ajout des routes des commentaires

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
