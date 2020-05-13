let ul = document.getElementById('message');
let socket = io('http://localhost:4242');

let login;

$('#loginform').submit((e) => {
    e.preventDefault();

    if ($('#login').val() != "" && $('#login').val().length >= 3) {
        login = $('#login').val();
        $('.divform').fadeOut();
        socket.emit('login', login);
    }
});

$('#send').keypress(function(e) {
    var key = e.which;
    if(key == 13) {
        message();
    }
});

function message() {
    let val = $('#send').val();

    if ($('#send').val() != "") {
        socket.emit('message', { content: val, name: login });
        $('#send').val('');
        console.log('message emited');
    }

    $('#send').focus();
}

socket.on('message', function (data) {
    let li = document.createElement('li');
    li.innerHTML = data;

    if (li.children[0].nodeName == "SPAN") {
        console.log(li.children[0].nodeName);
    }

    if((li.children[0]) != undefined) {
        if (li.children[0].textContent == login + ":") {
            li.classList.add("textsend");
        } 
        else if (li.children[0].nodeName == "SPAN") {
            li.classList.add("textstatus");
        } 
        else {
            li.classList.add("textreceived");
        }
    }

    ul.appendChild(li);
});