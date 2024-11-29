const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();
const http = require('http');
const { isBlacklisted } = require('./service/authService');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 

const app = express();
const port = 3000;

const authorizationRoutes = require('./routes/authorization');

// Middleware
app.use(cors({ 
    origin: 'http://localhost:5173',
    credentials: true 
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use('/', require('./routes/signin'));
app.use('/', require('./routes/signup'));
app.use('/', require('./routes/logout'));
app.use('/', require('./routes/reservation'));
app.use('/', require('./routes/hebergement'));
app.use('/', require('./routes/promotion'));
app.use('/', require('./routes/authorization'));
app.use('/api', authorizationRoutes);
app.use((req, res, next) => {
    res.status(404).json({ error: '404 - Page not found' });
});

// Start server
const server = http.createServer(app);

// Configurer le serveur pour gérer les connexions WebSocket
server.on('upgrade', (request, socket, head) => {
    const token = request.headers['auth-token'];
    if (!token || isBlacklisted(token)) {
        socket.destroy();
        return;
    }
    const { wss } = require('./utils/websocket');
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
