const socket = io();

socket.emit('newPlayer');

const drawPlayer = (player) => {
            let playerElemnt = document.getElementById('head')
            playerElemnt.innerHTML =`<div class="player" style= width:${player.width};height:${player.height};top:${player.y};left:${player.x}></div>`;
      }

socket.on('state', (gameState) => {
    for (let player in gameState.players) {
        drawPlayer(gameState.players[player])
    }
})

const playerMovement = {
    up: false,
    down: false,
    left: false,
    right: false
};

const keyDownHandler = (e) => {
    if (e.keyCode == 39) {
        playerMovement.right = true;
    } else if (e.keyCode == 37) {
        playerMovement.left = true;
    } else if (e.keyCode == 38) {
        playerMovement.up = true;
    } else if (e.keyCode == 40) {
        playerMovement.down = true;
    }
};
const keyUpHandler = (e) => {
    if (e.keyCode == 39) {
        playerMovement.right = false;
    } else if (e.keyCode == 37) {
        playerMovement.left = false;
    } else if (e.keyCode == 38) {
        playerMovement.up = false;
    } else if (e.keyCode == 40) {
        playerMovement.down = false;
    }
};



setInterval(() => {
    socket.emit('playerMovement', playerMovement);
  }, 1000 / 60);
  
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);