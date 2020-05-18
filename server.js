const config = require("config");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static(__dirname + '/src/css'));
app.use(express.static(__dirname + '/src/client'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/src/view/showroom.html");
});

app.get('/room/:room', (req, res) => {
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

    client.on('update login', data => {
        client.name = data.name;
        client.broadcast.emit('message', "<span class='status'>" + data.content + "</span>");
    });

    client.on('disconnect', () => {
        if (client.name) {
            console.log("Client disconnected : " + client.name);
            client.broadcast.emit('message',"<span class='status'>" + client.name + ' leaving !</spanZ>');
        }
    });

    client.on('create', (data) => {
        if (data) {
            client.join(data);
        }

        let allRooms = [];
        let rooms = io.sockets.adapter.rooms;

        if (rooms) {
            for (var room in rooms) {
                if (!rooms[room].hasOwnProperty(room)) {
                    allRooms.push(room);
                }
            }
        }
        console.log(allRooms);
        client.emit('create', allRooms);
    });
    
    client.emit('show room', () => {
        console.log(io.sockets.adapter.rooms);
    });
});

server.listen(config.app.port);