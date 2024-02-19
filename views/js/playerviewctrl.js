let socket = io();
let btn;
let text;

function initializeView() {
    console.log("Onload")
    btn = document.getElementById('playerbtn');
    playerName = document.getElementById('playerNameInput');

}

function onPlayerNameSubmit() {
    var player = {
        "id": 0,
        "name": "Player name"
    }
    console.log("on player init")
//   socket.emit('playerconnect', player)
    window.location='controllerview.html'
}