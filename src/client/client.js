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

// if ($('#listeRoom').val() == "") {
//     let li = document.createElement('h3');
//     li.innerHTML = "No rooms, create one &#x2197;";
//     ulRoom.appendChild(li);
// }

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
    }
    afficheRoom();
}

function seeCurrentRoom() {
    socket.emit('create');
    afficheRoom();
}

function afficheRoom() {
    socket.on('create', data => {
        let ulRoom = document.getElementById('listeRoom');
        ulRoom.innerHTML = "";
        data.map( room => {
            let li = document.createElement('li');
            li.classList.add("displayflex");
            li.innerHTML = "<span class='col-md-5'>" + room + "</span>\
                            <span class='col-md-7 join'>\
                                <a href='/room/" + room + "'>\
                                    <button class='btn btn-success'>Join</button>\
                                </a>\
                            </span>";
            ulRoom.appendChild(li);
        });
    });
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