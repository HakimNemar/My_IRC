let ul = document.getElementById('message');
let socket = io('http://localhost:4242');

let login;

$('#loginform').submit((e) => {
    e.preventDefault();

    if ($('#login').val() != "" && $('#login').val().length >= 3) {
        login = $('#login').val();
        $('.divform').fadeOut();
        socket.emit('login', login);
        $('#updatelogin')[0].textContent = login;
    }
});

$('#send').keypress((e) => {
    var key = e.which;
    if(key == 13) {
        message();
    }
});

function updateLogin() {
    let bul = prompt('Change login:', login);

    if (bul != null) {
        if (bul.length >= 3) {
            socket.emit('update login', { content: "<b>" + login + "</b> change his login to <b>" + bul + "</b>", name: bul });

            $('.login').map((log, text) => {
                if (text.innerHTML == login + ":") {
                    text.innerHTML = bul + ":";
                }
            });
            
            login = bul;
            $('#updatelogin')[0].textContent = login;
            alert('Your new login is: ' + login); 
        }
        else {
            alert('Your login must be 3 characters');
            updateLogin();
        }
    }
}

function message() {
    let val = $('#send').val();

    if ($('#send').val() != "") {
        socket.emit('message', { content: val, name: login });
        $('#send').val('');
        console.log('message emited');
    }

    $('#send').focus();
}

function createroom() {
    let room = prompt('Room name:');

    if (room != null) {
        socket.emit('create', room);
        // socket.emit('show room');

        console.log(socket);
    }
}

socket.on('message', (data) => {
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

// socket.on('update login', (data) => {
//     console.log(data);
//     let li = document.createElement('li');
//     li.innerHTML = data;
//     ul.appendChild(li);
// });