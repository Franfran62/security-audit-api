const WebSocket = require('ws');
const { verifyToken } = require('../security/security'); 

const wss = new WebSocket.Server({ noServer: true });
let clients = [];

wss.on('connection', (ws, request) => {
    const token = request.headers['auth-token'];
    if (!verifyToken(token)) {
        ws.close(1008, 'Impossible de se connecter au réseau');
        return;
    }
    ws.token = token;
    clients.push(ws);
    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

function sendWebSocketMessage(message) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function closeWebSocketConnection(token) {
    clients.forEach(client => {
        if (client.token === token && client.readyState === WebSocket.OPEN) {
            clients = clients.filter(client => client !== ws);
            client.close(1000, 'Déconnexion de l\'utilisateur');
        }
    });
}

function checkTokens() {
    clients.forEach(client => {
        if (!verifyToken(client.token)) {
            clients = clients.filter(client => client !== ws);
            client.close(1000, 'Déconnexion de l\'utilisateur');
        }
    });
}

setInterval(checkTokens, 30000);

module.exports = { wss, sendWebSocketMessage, closeWebSocketConnection };