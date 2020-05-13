const config = require("config");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const SessionSocket = require('session.socket.io');
// sessionSocket = new SessionSocket(io, sessionStore, cookieParser);

app.use(express.static(__dirname + '/src/css'));
app.use(express.static(__dirname + '/src/client'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/src/view/index.html");
});

let clients = [];

io.on('connection', client => {
    client.on('login', (login) => {
        client.name = login;
        clients.push(client);
        console.log("Client connected : " + login);
        client.broadcast.emit('message',"<span class='status'>" + login +' is connected !</span>');

        client.on('message', data => {
            console.log('Event received :', data.content);
            clients.map((client) => {
                client.emit('message', "<p class='login'>" + data.name + ":</p> " + data.content);
            });
        });
    });

    client.on('disconnect', () => {
        if (client.name) {
            console.log("Client disconnected : " + client.name);
            client.broadcast.emit('message',"<span class='status'>" + client.name + ' leaving !</spanZ>');
        }
    });
});

server.listen(config.app.port);