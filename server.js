const config = require("config");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const SessionSocket = require('session.socket.io');
// sessionSocket = new SessionSocket(io, sessionStore, cookieParser);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/view/index.html");
});

let clients = [];

io.on('connection', client => {
    clients.push(client);
    client.on('message', data => {
        console.log('Event received :', data);
        clients.map((client) => {
            client.emit('message', data);
        });
    });

    client.on('login', (login) => {
        console.log("Client connected : " + login);
        client.broadcast.emit('message', login +' vient de se connecter !');
    });

    client.on('disconnect', () => { });
});

server.listen(config.app.port);