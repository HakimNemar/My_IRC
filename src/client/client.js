let ul = document.getElementById('message');
let socket = io('http://localhost:4242');

let login;

$('#loginform').submit((e) => {
    e.preventDefault();

    if ($('#login').val() != "" && $('#login').val().length >= 3) {
        login = $('#login').val();
        $('.divform').fadeOut();
        let room = $('.contentmsg').attr('id');
        socket.emit('login', {login: login, room: room});
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
    let room = $('.contentmsg').attr('id');

    if ($('#send').val() != "") {
        if ($('#send').val().substr(0, 1) == "/") {
            if ($('#send').val().substr(0, 6) == "/nick ") {
                socket.emit('update login', { 
                    content: "<b>" + login + "</b> change his login to <b>" + $('#send').val().substr(6) + "</b>",
                    name: $('#send').val().substr(6)
                });

                $('.login').map((log, text) => {
                    if (text.innerHTML == login + ":") {
                        text.innerHTML = $('#send').val().substr(6) + ":";
                    }
                });

                login = $('#send').val().substr(6);
                $('#updatelogin')[0].textContent = login;
            }
            else if ($('#send').val().substr(0, 5) == "/list") {
                // console.log($('#send').val().substr(0, 6));
                if ($('#send').val().split(' ').length == 1) {
                    socket.emit('show room');
                    let nbr = 1;
                    socket.on('show room', data => {
                        if (nbr < 2) {
                            socket.emit('message', { content: data, name: login, room: room });
                            nbr++;
                        }
                    });
                }
                else if ($('#send').val().split(' ').length == 2) {
                    socket.emit('show room');
                    let nbr = 1;
                    let str = $('#send').val().split(' ')[1];
                    socket.on('show room', data => {
                        if (nbr < 2) {
                            let tab = [];
                            data.map( res => {
                                if (res.includes(str)) {
                                    tab.push(res);
                                }
                            });
                            socket.emit('message', { content: tab, name: login, room: room });
                            nbr++;
                        }
                    });
                }
            }
            $('#send').val('');
        }
        else {   
            socket.emit('message', { content: val, name: login, room: room });
            $('#send').val('');
            console.log('message emited');
        }
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

afficheRoom();
socket.emit('create');

function afficheRoom() {
    socket.on('create', data => {
        let ulRoom = document.getElementById('listeRoom');
        ulRoom.innerHTML = "";
        
        data.map( room => {
            let li = document.createElement('li');
            li.classList.add("displayflex");
            li.innerHTML = "<span class='col-md-5'>" + room + "</span>\
                            <span class='col-md-7 join'>\
                                <button class='btn btn-success rejoin' name='" + room + "'>rejoin</button>\
                            </span>";
            ulRoom.appendChild(li);
        });

        $('.rejoin').click( function() {
            socket.emit('rejoinRoom', this.name );
            $('.areroom')[0].innerHTML = 'You are in room: "' + this.name + '"';
            $('.contentmsg').css("display", "block");
            $('.contentmsg').attr('id', this.name);
            
            // $('.contentmsg').css("display", "block");
            // let content = $('.contentmsg')[0];
            // let div = document.createElement('div');
            // div.innerHTML = "<h1 class='areroom'></h1>\
            //                 <div class=''>\
            //                     <button id='updatelogin' onClick='updateLogin()'>Login</button>\
            //                 </div>\
            //                 <div class=''>\
            //                     <ul id='message'></ul>\
            //                     <div class='divsend'>\
            //                         <input type='text' name='send' id='send'>\
            //                         <button onClick='message()' type='submit' id='btnsend'>Send</button>\
            //                     </div>\
            //                 </div>";
            // div.classList.add("container");
            // content.appendChild(div);
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