const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/*', (req, res, next) => {
	res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

const gameState = {
	players: {}
  }



app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send(err.message || 'Internal server error');
});

io.on('connection', (socket) => {
	console.log('a user connected:', socket.id);
	socket.on('newPlayer', () => {
		gameState.players[socket.id] = {
					width : "50px",
					height : "50px",
					x : 200,
					y :200
			}
		})
		
	  socket.on('playerMovement', (playerMovement) => {
		const player = gameState.players[socket.id]
			if (playerMovement.left && player.x > 0) {
				player.x -= 4
			}
			if (playerMovement.right && player.x) {
			player.x += 4
		}
			
			if (playerMovement.up && player.y > 0) {
				player.y -= 4
			}
			if (playerMovement.down) {
				player.y += 4
			}
		});
	})

		setInterval(() => {
			io.sockets.emit('state', gameState)
		}, 1000 / 60)

server.listen(PORT, () => {
	console.log('Server is live on PORT:', PORT);
})
