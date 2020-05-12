let socket = io('http://localhost:4242');
let ul = document.getElementById('message');

function message() {
    let val = document.getElementById('send').value;
    socket.emit('chat message', val);
    console.log('message emited');
}

socket.on('chat message', function (data) {
    let li = document.createElement('li');
    li.innerHTML = data;
    ul.appendChild(li);
});